import { supabase } from './supabase';

const BUCKET = 'projects';

// ── Helper: upload an image file to Supabase Storage and return its public URL
const uploadImage = async (file) => {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  console.log('Initiating image upload to bucket:', BUCKET);
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { upsert: false });

  if (uploadError) {
    console.error('SUPABASE STORAGE UPLOAD ERROR:', uploadError.message);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return { publicUrl: data.publicUrl, storagePath: fileName };
};

// ── Helper: delete an image from Supabase Storage by its path
const deleteImage = async (storagePath) => {
  if (!storagePath) return;
  await supabase.storage.from(BUCKET).remove([storagePath]);
};

// ── Derive storage path from a public URL
const getStoragePath = (imageUrl) => {
  if (!imageUrl) return null;
  try {
    const url = new URL(imageUrl);
    // URL format: .../storage/v1/object/public/{bucket}/{path}
    const segments = url.pathname.split(`/object/public/${BUCKET}/`);
    return segments[1] || null;
  } catch {
    return null;
  }
};

// ── Public project queries
export const projectsAPI = {
  // Fetch all projects, newest first
  getAll: async (category) => {
    let query = supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Fetch project counts grouped by category
  getCategoryCounts: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('category');

    if (error) throw error;

    const counts = data.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    return counts;
  },

  // Fetch a single project by id
  getById: async (id) => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // Create a project (with optional image file)
  create: async ({ title, description, category, tools, imageFile }) => {
    let image_url = null;

    if (imageFile) {
      const { publicUrl } = await uploadImage(imageFile);
      image_url = publicUrl;
    }

    console.log('Inserting project into database table:', 'projects');
    const { data, error } = await supabase
      .from('projects')
      .insert([{ title, description, category, tools, image_url }])
      .select()
      .single();

    if (error) {
      console.error('SUPABASE DATABASE INSERT ERROR:', error.message);
      console.error('Error Code:', error.code);
      console.error('Error Details:', error.details);
      throw error;
    }
    
    console.log('Project successfully created:', data);
    return data;
  },

  // Update a project (replacing image if a new file is supplied)
  update: async (id, { title, description, category, tools, imageFile, existingImageUrl }) => {
    let image_url = existingImageUrl;

    if (imageFile) {
      // Remove old image first
      const oldPath = getStoragePath(existingImageUrl);
      if (oldPath) await deleteImage(oldPath);

      const { publicUrl } = await uploadImage(imageFile);
      image_url = publicUrl;
    }

    const { data, error } = await supabase
      .from('projects')
      .update({ title, description, category, tools, image_url })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a project and its storage image
  delete: async (id, imageUrl) => {
    const storagePath = getStoragePath(imageUrl);
    if (storagePath) await deleteImage(storagePath);

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },
};

// ── Categories queries
export const categoriesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  updateImage: async (categoryName, imageFile) => {
    // 1. Upload image to 'projects' bucket (reusing uploadImage)
    const { publicUrl } = await uploadImage(imageFile);

    // 2. Update category record
    const { data, error } = await supabase
      .from('categories')
      .update({ image_url: publicUrl })
      .eq('name', categoryName)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ── Auth helpers
export const authAPI = {
  login: (email, password) =>
    supabase.auth.signInWithPassword({ email, password }),

  logout: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  onAuthChange: (callback) => supabase.auth.onAuthStateChange(callback),
};
// ── Certifications queries
export const certificationsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  create: async ({ title, organization, link, imageFile }) => {
    let image_url = null;
    if (imageFile) {
      const { publicUrl } = await uploadImage(imageFile);
      image_url = publicUrl;
    }
    const { data, error } = await supabase
      .from('certifications')
      .insert([{ title, organization, link, image_url }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, { title, organization, link, imageFile, existingImageUrl }) => {
    let image_url = existingImageUrl;
    if (imageFile) {
      const oldPath = getStoragePath(existingImageUrl);
      if (oldPath) await deleteImage(oldPath);
      const { publicUrl } = await uploadImage(imageFile);
      image_url = publicUrl;
    }
    const { data, error } = await supabase
      .from('certifications')
      .update({ title, organization, link, image_url })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id, imageUrl) => {
    const storagePath = getStoragePath(imageUrl);
    if (storagePath) await deleteImage(storagePath);
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (error) throw error;
  },
};

export default { projectsAPI, categoriesAPI, certificationsAPI, authAPI };

// ── Experiences queries
export const experiencesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data;
  },

  create: async ({ company, role, period, location, description, skills, sort_order }) => {
    const { data, error } = await supabase
      .from('experiences')
      .insert([{ company, role, period, location, description, skills, sort_order: sort_order || 0 }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id, { company, role, period, location, description, skills, sort_order }) => {
    const { data, error } = await supabase
      .from('experiences')
      .update({ company, role, period, location, description, skills, sort_order })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) throw error;
  },
};

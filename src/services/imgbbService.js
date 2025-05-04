export async function uploadImage(file) {
    const form = new FormData();
    form.set('image', file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
      { method: 'POST', body: form }
    );
    const json = await res.json();
    return json.data.url;
  }
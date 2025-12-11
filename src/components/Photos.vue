<template>
  <div>
    <h1>Photo List</h1>
    <div v-if="loading">Loading posts...</div>
    <ul v-if="posts.length && !loading">
      <li v-for="post in posts" :key="post.photo_id">
        {{ post.photo_file }} | {{ post.date_uploaded }}
      </li>
    </ul>
    <div v-if="error" class="error">
      Failed to load photos: {{ error.message }}
    </div>
  </div>
  <div>
    <h1>Upload</h1>
    <form id="upload_form">
      file_name: <input type="text" name="photo_file">
      date: <input type="date" name="date_uploaded">
      <button type="button" @click="convertToJson">Help</button>
    </form>

    <form v-bind:action="api_url+'/photos'" method="post" enctype="multipart/form-data">
      Select image to upload:
      <input type="file" name="fileToUpload" id="fileToUpload">
      <input type="submit" value="Upload Image" name="submit">
    </form>
  </div>
</template>

<script>
import { api_url, api } from '../services/api';

export default {
  data() {
    return {
      api_url: api_url,
      posts: [],
      loading: false,
      error: null
    }
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    async convertToJson(event) {
      // event is the native DOM event
      console.log(document.querySelector('my-form'))
      let form = document.getElementById("upload_form");
      let form_data = {};
      for (let i = 0; i < form.elements.length; i++) {
          let element = form.elements[i];
          if (element.type !== "button") {
              form_data[element.name] = element.value;
          }
      }
      
      try {
        const response = await api.post('/photos', form_data, {
              headers: {
                'Content-Type': 'application/json'
              }
            });
        console.log(response.data);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
        this.fetchPosts();
      }
    },
    async fetchPosts() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/photos');
        this.posts = response.data;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async createPost() {
      var file_name = document.getElementById('file_name').value;
      var date = document.getElementById('date').value;

      this.loading = true;
      this.error = null;
      console.log(date);

      try {
        const response = await api.post('/photos', document.querySelector('#my-form'), {
  headers: {
    'Content-Type': 'application/json'
  }
});
        this.posts.push(response.data);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async updatePost(id, title) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.put(`/posts/${id}`, { title, body: 'Updated post', userId: 1 });
        const index = this.posts.findIndex(post => post.id === id);
        if (index !== -1) {
          this.posts.splice(index, 1, response.data);
        }
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async deletePost(id) {
      this.loading = true;
      this.error = null;

      try {
        await api.delete(`/posts/${id}`);
        this.posts = this.posts.filter(post => post.id !== id);
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style>
.error {
  color: red;
}
</style>
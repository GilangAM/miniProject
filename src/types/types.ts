export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
  }
  
  export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
  }
  
  export interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
  }
  
  export interface Album {
    userId: number;
    id: number;
    title: string;
  }
  
  export interface Photo {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
  }
  
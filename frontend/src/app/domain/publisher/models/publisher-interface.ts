export interface Publisher {
    isPublisherOpen: boolean;
    publishType: string;    // reply, community, post
    contentType: string;    // image, text
    text?: string;
    imageUrlOrIpfsPayload?: string;
    community?: string;
    title?: string;         // Used for blog
    isMediaUploading: boolean;
}

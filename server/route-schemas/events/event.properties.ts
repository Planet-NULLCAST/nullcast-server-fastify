export function eventProps(user: string) {
  const event = {
    title: {
      type: 'string',
      description: 'user should provide title'
    },
    guest_name: {
      type: 'string',
      description: 'user should provide name of the guest'
    },
    guest_designation: {
      type: 'string',
      description: 'user should provide designation of the guest'
    },
    guest_image: {
      type: 'string',
      description: 'user should provide image of the guest'
    },
    guest_bio: {
      type: 'string',
      description: 'user should provide bio of the guest'
    },
    registration_link: {
      type: 'string',
      description: 'user should provide link of registration of the event'
    },
    type: {
      type: 'string',
      description: 'user should provide type'
    },
    slug: {
      type: 'string',
      description: 'Url of the event'
    },
    description: {
      type: 'string',
      description: 'user should provide description'
    },
    meta_description: {
      type: 'string',
      description: 'user should provide meta_description'
    },
    meta_title: {
      type: 'string',
      description: 'user should provide meta_title'
    },
    banner_image: {
      type: 'string',
      description: 'user should provide banner_image'
    },
    preview_url: {
      type: 'string',
      description: 'user should provide preview_url'
    },
    canonical_url: {
      type: 'string',
      description: 'user should provide canonical_url'
    },
    featured: {
      type: 'boolean',
      description: 'user should provide featured'
    },
    visibility: {
      type: 'string',
      description: 'user should provide visibility'
    },
    status: {
      type: 'string',
      default: 'pending',
      enum: ['', 'pending', 'drafted', 'published', 'rejected'],
      description: 'user should provide status'
    },
    event_time: {
      type: 'string',
      description: 'Time of the event'
    }
  };
  if (user === 'admin') {
    event.status.default = 'published';
  }
  return event;
}

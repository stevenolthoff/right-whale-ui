import React from 'react'
import './resources.css'

interface WordPressPost {
  id: number
  content: {
    rendered: string
  }
  title: {
    rendered: string
  }
}

export default async function Resources() {
  const data = await fetch(
    'https://right-whale.sites.axds.co/wp-json/wp/v2/pages?slug=resources',
    { next: { revalidate: 3600 } } // Revalidate every hour
  )
  const posts = await data.json() as WordPressPost[]

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-slate-50'>
      <div className='max-w-4xl mx-auto px-4 pt-28 pb-20'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-blue-900 mb-4'>Resources</h1>
          <p className='text-slate-600 max-w-2xl mx-auto'>
            Access valuable information and research materials about North Atlantic Right Whales
            and conservation efforts.
          </p>
        </div>

        {/* WordPress Styles */}
        <link
          rel='stylesheet'
          type='text/css'
          href='https://right-whale.sites.axds.co/wp-includes/css/dist/block-library/style.min.css?ver=6.6.1'
        />

        {/* Content Section */}
        <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-8'>
          {posts.map((post) => (
            <div key={post.id} className='prose prose-slate max-w-none'>
              <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

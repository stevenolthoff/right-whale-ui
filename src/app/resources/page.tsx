import React from 'react'
import './resources.css'

export default async function Resources() {
  const data = await fetch(
    'https://right-whale.sites.axds.co/wp-json/wp/v2/pages?slug=resources'
  )
  const posts = await data.json()
  return (
    <div className='max-w-xl mx-auto pt-32 pb-16'>
      <link
        rel='stylesheet'
        type='text/css'
        href='https://right-whale.sites.axds.co/wp-includes/css/dist/block-library/style.min.css?ver=6.6.1'
      ></link>
      <h1 className='text-3xl pb-8'>Resources</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </div>
      ))}
    </div>
  )
}

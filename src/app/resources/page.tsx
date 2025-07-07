'use client'
import React, { useEffect, useState } from 'react'
import './resources.css'
import { RW_WORDPRESS_URL_CONFIG, url_join } from '../config'

interface WordPressPost {
  id: number
  content: {
    rendered: string
  }
  title: {
    rendered: string
  }
}

export default function Resources() {
  const [posts, setPosts] = useState<WordPressPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          url_join(
            RW_WORDPRESS_URL_CONFIG.RW_WORDPRESS_BASE_URL,
            '/wp-json/wp/v2/pages?slug=resources'
          )
        )
        const json = await res.json()
        setPosts(json)
      } catch (error) {
        console.error('Error fetching resources:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 10000) // Poll every 10s

    return () => clearInterval(interval)
  }, [])

  // Add effect to modify links
  useEffect(() => {
    const modifyLinks = () => {
      const links = document.querySelectorAll('.prose a')
      links.forEach((link) => {
        link.setAttribute('target', '_blank')
        link.setAttribute('rel', 'noopener noreferrer')
      })
    }

    // Run after content is loaded
    if (!isLoading) {
      modifyLinks()
    }
  }, [isLoading])

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-slate-50'>
      <div className='max-w-4xl mx-auto px-4 pt-28 pb-20'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-blue-900 mb-4'>Resources</h1>
          <p className='text-slate-600 max-w-2xl mx-auto'>
            Access valuable information and research materials about North
            Atlantic Right Whales and conservation efforts.
          </p>
        </div>

        {/* WordPress Styles */}
        <link
          rel='stylesheet'
          type='text/css'
          href={
            url_join(
              RW_WORDPRESS_URL_CONFIG.RW_WORDPRESS_BASE_URL,
              '/wp-includes/css/dist/block-library/style.min.css?ver=6.6.1'
            )
          }
        />

        {/* Content Section */}
        <div className='bg-white rounded-2xl shadow-sm border border-slate-200 p-8'>
          {isLoading ? (
            <div className='text-center py-8'>
              <p className='text-slate-600'>Loading resources...</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className='prose prose-slate max-w-none'>
                <div
                  dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

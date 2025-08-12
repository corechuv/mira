import { supabase } from './supabase'

export type ReviewInput = { product_id: string; rating: number; text: string }
export async function fetchReviews(product_id: string, user_id?: string|null) {
  const query = supabase.from('reviews')
    .select('id, product_id, rating, text, created_at, user_id, status')
    .eq('product_id', product_id)
    .or(`status.eq.approved, user_id.eq.${user_id || ''}`)
    .order('created_at', { ascending: false })
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function submitReview(input: ReviewInput) {
  const { data, error } = await supabase.from('reviews').insert({
    product_id: input.product_id,
    rating: input.rating,
    text: input.text,
    status: 'pending'
  }).select('id').single()
  if (error) throw error
  return data?.id as string
}

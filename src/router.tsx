import { createBrowserRouter, Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ErrorBoundary from '@/components/ErrorBoundary'
import Loader from '@/components/Loader'
import { Suspense, lazy } from 'react'

const Home = lazy(()=>import('@/pages/Home'))
const Catalog = lazy(()=>import('@/pages/Catalog'))
const Product = lazy(()=>import('@/pages/Product'))
const Checkout = lazy(()=>import('@/pages/Checkout'))
const About = lazy(()=>import('@/pages/About'))
const Contact = lazy(()=>import('@/pages/Contact'))
const Profile = lazy(()=>import('@/pages/Profile'))
const Policy = lazy(()=>import('@/pages/Policy'))
const NotFound = lazy(()=>import('@/pages/NotFound'))
const SignIn = lazy(()=>import('@/pages/SignIn'))
const SignUp = lazy(()=>import('@/pages/SignUp'))
const Orders = lazy(()=>import('@/pages/Orders'))
const Favorites = lazy(()=>import('@/pages/Favorites'))
const Compare = lazy(()=>import('@/pages/Compare'))

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <AdminGuard><AdminLayout /></AdminGuard>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'categories', element: <CategoriesAdmin /> },
      { path: 'products', element: <ProductsAdmin /> },
      { path: 'reviews', element: <ReviewsAdmin /> },
      { path: 'orders', element: <OrdersAdmin /> }
    ]
  },
  {
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/catalog', element: <Catalog /> },
      { path: '/product/:id', element: <Product /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/about', element: <About /> },
      { path: '/contact', element: <Contact /> },
      { path: '/profile', element: <Profile /> },
      { path: '/policy', element: <Policy /> },
      { path: '/sign-in', element: <SignIn /> },
      { path: '/sign-up', element: <SignUp /> },
      { path: '/orders', element: <Orders /> },
      { path: '/favorites', element: <Favorites /> },
      { path: '/compare', element: <Compare /> },
      { path: '*', element: <NotFound /> }
    ]
  }
])

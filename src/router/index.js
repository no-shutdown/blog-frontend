import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import PublicLayout from '@/components/layout/PublicLayout.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const HomeView = () => import('@/views/public/HomeView.vue')
const ArticleView = () => import('@/views/public/ArticleView.vue')
const CategoryView = () => import('@/views/public/CategoryView.vue')
const TagView = () => import('@/views/public/TagView.vue')
const ArchiveView = () => import('@/views/public/ArchiveView.vue')
const AboutView = () => import('@/views/public/AboutView.vue')
const LinksView = () => import('@/views/public/LinksView.vue')

const LoginView = () => import('@/views/admin/LoginView.vue')
const DashboardView = () => import('@/views/admin/DashboardView.vue')
const ArticleListView = () => import('@/views/admin/ArticleListView.vue')
const ArticleEditView = () => import('@/views/admin/ArticleEditView.vue')
const AdminCategoryView = () => import('@/views/admin/CategoryView.vue')
const AdminTagView = () => import('@/views/admin/TagView.vue')
const CommentView = () => import('@/views/admin/CommentView.vue')
const LinkView = () => import('@/views/admin/LinkView.vue')
const PageEditView = () => import('@/views/admin/PageEditView.vue')

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'article/:id', name: 'article', component: ArticleView },
      { path: 'category/:id', name: 'category', component: CategoryView },
      { path: 'tag/:id', name: 'tag', component: TagView },
      { path: 'archive', name: 'archive', component: ArchiveView },
      { path: 'about', name: 'about', component: AboutView },
      { path: 'links', name: 'links', component: LinksView }
    ]
  },
  { path: '/admin/login', name: 'login', component: LoginView },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'dashboard', component: DashboardView },
      { path: 'articles', name: 'articleList', component: ArticleListView },
      { path: 'articles/new', name: 'articleNew', component: ArticleEditView },
      { path: 'articles/:id', name: 'articleEdit', component: ArticleEditView },
      { path: 'categories', name: 'categories', component: AdminCategoryView },
      { path: 'tags', name: 'tags', component: AdminTagView },
      { path: 'comments', name: 'comments', component: CommentView },
      { path: 'links', name: 'adminLinks', component: LinkView },
      { path: 'pages/about', name: 'pageAbout', component: PageEditView }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const auth = useAuthStore()
    if (!auth.token) {
      return { name: 'login' }
    }
  }
  return true
})

export default router

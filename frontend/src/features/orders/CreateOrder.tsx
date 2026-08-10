import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ChevronDown, Minus, Plus, Search, ShoppingBasket, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { categoryApi } from '@/api/categoryApi'
import { mealsApi } from '@/api/mealsApi'
import type { Category } from '@/types/category'
import type { Meal } from '@/types/meal'

type OrderType = 'Delivery' | 'Pickup' | 'Dine-in'

interface MenuItem {
	id: number
	name: string
	category: string
	price: number
	image: string | null
}

interface CartItem extends MenuItem {
	quantity: number
}

const getMealPrice = (meal: Meal) => {
	const variationPrice = meal.variations?.find((variation) => Number.isFinite(Number(variation.price)))?.price
	const price = Number(meal.totalPrice ?? meal.basePrice ?? variationPrice ?? 0)
	return Number.isFinite(price) ? price : 0
}

const formatCurrency = (amount: number | null | undefined) =>
	`LKR ${Number(amount ?? 0).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`

export function CreateOrderPage() {
	const [activeCategory, setActiveCategory] = useState('All')
	const [search, setSearch] = useState('')
	const [orderType, setOrderType] = useState<OrderType>('Delivery')
	const [customer, setCustomer] = useState('Walk-in Customer')
	const [cart, setCart] = useState<CartItem[]>([])
	const [categories, setCategories] = useState<Category[]>([])
	const [meals, setMeals] = useState<Meal[]>([])

	const filteredItems = useMemo(
		() =>
			meals.map((meal) => ({
				id: meal.id,
				name: meal.name,
				category: categories.find((category) => category.id === meal.categoryId)?.name ?? 'Uncategorized',
				price: getMealPrice(meal),
				image: meal.imageUrl,
			})).filter((item) => {
				const matchesCategory =
					activeCategory === 'All' || item.category === activeCategory
				return matchesCategory && item.name.toLowerCase().includes(search.toLowerCase())
			}),
		[activeCategory, categories, meals, search],
	)

	useEffect(() => {
		Promise.all([
			categoryApi.getPage({ size : 100}),
			mealsApi.getPage({ size : 100}),
		])
		.then(([CatData, MealData]) => {
			const activeCategories = CatData.content.filter(
				(category) => category.status === 'ACTIVE'
			)
			const activeMeals = MealData.content.filter(
				(meal) => meal.status === 'ACTIVE'
			)

			setCategories(activeCategories)
			setMeals(activeMeals)
		})
		.catch((error) => {
			console.error('Error fetching categories and meals:', error)
		})
		.finally(() => {
		})
	}, [])

	const menuItems = useMemo<MenuItem[]>(
		() => meals.map((meal) => ({
			id: meal.id,
			name: meal.name,
			category: categories.find((category) => category.id === meal.categoryId)?.name ?? 'Uncategorized',
			price: getMealPrice(meal),
			image: meal.imageUrl,
		})),
		[categories, meals],
	)

	const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0)
	const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0)

	const updateCart = (item: MenuItem, change: number) => {
		setCart((current) => {
			const existing = current.find((cartItem) => cartItem.id === item.id)
			if (!existing && change > 0) return [...current, { ...item, quantity: 1 }]
			return current.flatMap((cartItem) =>
				cartItem.id === item.id
					? cartItem.quantity + change > 0
						? [{ ...cartItem, quantity: cartItem.quantity + change }]
						: []
					: cartItem,
			)
		})
	}

	return (
		<main className="flex h-screen min-h-[620px] flex-col overflow-hidden bg-[#f4f6f8] text-slate-800">
			<header className="flex h-[74px] shrink-0 items-center border-b border-slate-200 bg-white px-5 sm:px-8">
				<Link
					to="/orders"
					className="mr-5 flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-600 transition hover:border-red-300 hover:text-red-600"
				>
					<ArrowLeft size={15} /> Back
				</Link>
				<h1 className="text-2xl font-black tracking-tight text-slate-900">POS</h1>
			</header>

			<div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_390px]">
				<section className="flex min-h-0 flex-col">
					<div className="flex min-h-[106px] shrink-0 items-center bg-[#f0cbd0] px-5 py-4 sm:px-8">
						<div className="w-full max-w-[430px]">
							<p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-red-700">
								Current Order
							</p>
							{cart.length > 0 ? (
								<div className="flex w-fit items-center gap-3 rounded-xl bg-white/75 p-2 shadow-sm">
									{cart[0].image ? <img src={cart[0].image} alt={cart[0].name} className="h-12 w-12 rounded-lg object-cover" /> : <div className="h-12 w-12 rounded-lg bg-slate-100" />}
									<div className="min-w-0">
										<p className="max-w-[180px] truncate text-sm font-bold">{cart[0].name}</p>
										<p className="text-xs text-slate-500">Standard · lunch · Qty {cart[0].quantity}</p>
										<p className="text-sm font-black text-slate-700">{formatCurrency(cart[0].price * cart[0].quantity)}</p>
									</div>
									<button
										onClick={() => updateCart(cart[0], -cart[0].quantity)}
										aria-label="Remove current order item"
										className="self-start rounded-full p-1 text-red-500 hover:bg-red-50"
									>
										<X size={16} />
									</button>
								</div>
							) : (
								<p className="text-sm text-red-800">
									Your order is empty. Add a meal to get started.
								</p>
							)}
						</div>
					</div>

					<div className="flex min-h-0 flex-1 flex-col bg-[#f7f8fa] px-4 py-4 sm:px-8">
                        <div className="mb-4 flex items-center justify-between gap-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Menu</p>
                            <label className="flex w-full max-w-[285px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-400 shadow-sm">
                                <Search size={16} />
                                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search meals..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
                            </label>
                        </div>
                        <div className="flex min-h-0 flex-1 gap-4">
							<nav className="w-[138px] shrink-0 space-y-2 overflow-y-auto pr-1">
								{['All', ...categories.map((category) => category.name)].map((categoryName) => (
                                    <button
										key={categoryName}
										onClick={() => setActiveCategory(categoryName)}
										className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left text-xs font-bold transition ${activeCategory === categoryName ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-200 bg-white text-slate-700 hover:border-red-200'}`}
                                    >
										<span className="truncate">{categoryName}</span>
                                        <span className="ml-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-500">
											{categoryName === 'All' ? menuItems.length : menuItems.filter((item) => item.category === categoryName).length}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                            <div className="min-w-0 flex-1 overflow-y-auto pr-1">
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                                    {filteredItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => updateCart(item, 1)}
                                            className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md"
                                        >
											{item.image ? <img src={item.image} alt={item.name} className="h-28 w-full object-cover transition duration-300 group-hover:scale-105" /> : <div className="h-28 w-full bg-slate-100" />}
                                            <div className="p-3">
                                                <span className="inline-block rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                                                    From {formatCurrency(item.price)}
                                                </span>
                                                <p className="mt-3 min-h-10 text-sm font-bold leading-5 text-slate-800">{item.name}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

				<aside className="flex min-h-0 flex-col border-l border-slate-200 bg-white">
					<div className="flex-1 overflow-y-auto p-5 sm:p-6">
						<p className="mb-2 text-sm font-bold text-slate-600">Order Type</p>
						<div className="mb-3 grid grid-cols-3 gap-2">
							{(['Delivery', 'Pickup', 'Dine-in'] as OrderType[]).map((type) => (
								<button
									key={type}
									onClick={() => setOrderType(type)}
									className={`rounded-lg border py-2.5 text-xs font-bold transition ${orderType === type ? 'border-red-600 bg-red-600 text-white' : 'border-slate-200 text-slate-600 hover:border-red-300'}`}
								>
									{type}
								</button>
							))}
						</div>
						<button
							onClick={() => setCustomer(customer === 'Walk-in Customer' ? 'Regular Customer' : 'Walk-in Customer')}
							className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700 shadow-sm"
						>
							<span>{customer}</span>
							<ChevronDown size={16} className="text-slate-500" />
						</button>
						<div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 p-3">
							<span className="text-sm font-bold">Select Table</span>
							<button className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700">
								Show
							</button>
						</div>
						<div className="mt-6 space-y-3">
							{cart.map((item) => (
								<div
									key={item.id}
									className="flex items-center gap-3 border-b border-slate-100 pb-3"
								>
										{item.image ? <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover" /> : <div className="h-12 w-12 rounded-lg bg-slate-100" />}
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-bold">{item.name}</p>
										<p className="text-xs text-slate-500">{formatCurrency(item.price)}</p>
									</div>
									<div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
                                        <Button variant="ghost" size="sm" onClick={() => updateCart(item, -1)} aria-label={`Decrease ${item.name}`} className="rounded p-1 text-slate-500 hover:bg-slate-100">
                                            <Minus size={13} />
                                        </Button>
										<button
											onClick={() => updateCart(item, -1)}
											aria-label={`Decrease ${item.name}`}
											className="rounded p-1 text-slate-500 hover:bg-slate-100"
										>
											<Minus size={13} />
										</button>
										<span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
										<button
											onClick={() => updateCart(item, 1)}
											aria-label={`Increase ${item.name}`}
											className="rounded p-1 text-red-600 hover:bg-red-50"
										>
											<Plus size={13} />
										</button>
									</div>
									<button
										onClick={() => updateCart(item, -item.quantity)}
										aria-label={`Remove ${item.name}`}
										className="text-slate-400 hover:text-red-600"
									>
										<Trash2 size={15} />
									</button>
								</div>
							))}
						</div>
					</div>
					<div className="shrink-0 border-t border-slate-200 bg-[#f8fafb] text-sm font-bold">
						<div className="flex justify-between px-5 py-4">
							<span>Total Quantity</span>
							<span>{totalQuantity}</span>
						</div>
						<div className="flex justify-between border-t border-slate-200 px-5 py-4">
							<span>Total Amount</span>
							<span className="text-base text-emerald-600">{formatCurrency(totalAmount)}</span>
						</div>
						<button
							onClick={() => window.alert(`Order submitted for ${customer} (${orderType})`)}
							disabled={!cart.length}
							className="flex w-full items-center justify-center gap-2 bg-red-600 py-4 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
						>
							<ShoppingBasket size={17} /> Submit Order
						</button>
					</div>
				</aside>
			</div>
		</main>
	)
}

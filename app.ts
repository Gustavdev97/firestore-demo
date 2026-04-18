import { Component, inject, signal, computed } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  unit: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
  imports: [AsyncPipe],
})
export class App {
  private firestore = inject(Firestore);
  products$: Observable<Product[]>;

  cart = signal<CartItem[]>([]);
  showCart = signal(false);

  cartCount = computed(() => this.cart().reduce((sum, item) => sum + item.quantity, 0));
  cartTotal = computed(() => this.cart().reduce((sum, item) => sum + item.product.price * item.quantity, 0));

  constructor() {
    const productsRef = collection(this.firestore, 'products');
    this.products$ = collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
    this.seedProducts(productsRef);
  }

  private async seedProducts(productsRef: ReturnType<typeof collection>) {
    const snapshot = await getDocs(productsRef);
    if (!snapshot.empty) return;

    const initialProducts: Omit<Product, 'id'>[] = [
      { name: 'Premium Smör', description: 'Lyxigt lantgårdssmör med rik och krämig smak', price: 59, emoji: '🧈', unit: '500g' },
      { name: 'Extra Jungfrulig Olivolja', description: 'Kall-pressad från de bästa oliverna i Medelhavet', price: 129, emoji: '🫒', unit: '500ml' },
      { name: 'Ekologisk Kokosolja', description: 'Naturlig kokosolja, perfekt för bakning och stekning', price: 89, emoji: '🥥', unit: '400g' },
      { name: 'Lantgårds Ister', description: 'Traditionellt grisfett, perfekt för knapriga pommes frites', price: 49, emoji: '🐷', unit: '500g' },
      { name: 'Lyxig Gåsfett', description: 'Det finaste fettet för att rosta potatis till perfektion', price: 149, emoji: '🪿', unit: '320g' },
      { name: 'Kall-pressad Rapsolja', description: 'Svensk rapsolja med mild och nötig smak', price: 69, emoji: '🌼', unit: '750ml' },
      { name: 'Ghee – Klarat Smör', description: 'Indiskt klarat smör med hög rökpunkt och nötig arom', price: 149, emoji: '✨', unit: '300g' },
      { name: 'Valnötsolja', description: 'Delikat nötsolja, perfekt till sallader och marinader', price: 119, emoji: '🌰', unit: '250ml' },
    ];

    for (const product of initialProducts) {
      await addDoc(productsRef, product);
    }
  }

  addToCart(product: Product) {
    this.cart.update((items) => {
      const existing = items.find((i) => i.product.id === product.id);
      if (existing) {
        return items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  removeFromCart(productId: string | undefined) {
    this.cart.update((items) => items.filter((i) => i.product.id !== productId));
  }

  toggleCart() {
    this.showCart.update((v) => !v);
  }
}

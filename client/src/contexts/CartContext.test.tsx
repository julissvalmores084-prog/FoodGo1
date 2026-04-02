import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with empty cart", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.items).toEqual([]);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it("adds item to cart", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        foodItemId: 1,
        restaurantId: 1,
        name: "Chicken Inasal",
        price: 10000,
        quantity: 1,
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.name).toBe("Chicken Inasal");
    expect(result.current.getTotalItems()).toBe(1);
    expect(result.current.getTotalPrice()).toBe(10000);
  });

  it("increases quantity when adding duplicate item", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        foodItemId: 1,
        restaurantId: 1,
        name: "Chicken Inasal",
        price: 10000,
        quantity: 1,
      });
      result.current.addItem({
        foodItemId: 1,
        restaurantId: 1,
        name: "Chicken Inasal",
        price: 10000,
        quantity: 1,
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.quantity).toBe(2);
    expect(result.current.getTotalItems()).toBe(2);
  });

  it("removes item from cart", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        foodItemId: 1,
        restaurantId: 1,
        name: "Chicken Inasal",
        price: 10000,
        quantity: 1,
      });
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.removeItem(1);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.getTotalItems()).toBe(0);
  });

  it("updates item quantity", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        foodItemId: 1,
        restaurantId: 1,
        name: "Chicken Inasal",
        price: 10000,
        quantity: 1,
      });
    });

    act(() => {
      result.current.updateQuantity(1, 3);
    });

    expect(result.current.items[0]?.quantity).toBe(3);
    expect(result.current.getTotalItems()).toBe(3);
    expect(result.current.getTotalPrice()).toBe(30000);
  });

  it("removes item when quantity is set to 0", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        foodItemId: 1,
        restaurantId: 1,
        name: "Chicken Inasal",
        price: 10000,
        quantity: 1,
      });
    });

    act(() => {
      result.current.updateQuantity(1, 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("clears cart", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        foodItemId: 1,
        restaurantId: 1,
        name: "Chicken Inasal",
        price: 10000,
        quantity: 2,
      });
      result.current.addItem({
        foodItemId: 2,
        restaurantId: 1,
        name: "Fried Chicken",
        price: 8000,
        quantity: 1,
      });
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.getTotalItems()).toBe(0);
    expect(result.current.getTotalPrice()).toBe(0);
  });

  it("persists cart to localStorage", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        foodItemId: 1,
        restaurantId: 1,
        name: "Chicken Inasal",
        price: 10000,
        quantity: 1,
      });
    });

    const saved = localStorage.getItem("foodgo-cart");
    expect(saved).toBeTruthy();
    const parsed = JSON.parse(saved!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0]?.name).toBe("Chicken Inasal");
  });

  it("loads cart from localStorage", () => {
    const cartData = [
      {
        foodItemId: 1,
        restaurantId: 1,
        name: "Chicken Inasal",
        price: 10000,
        quantity: 2,
      },
    ];
    localStorage.setItem("foodgo-cart", JSON.stringify(cartData));

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    );
    const { result } = renderHook(() => useCart(), { wrapper });

    // Wait for effect to run
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.quantity).toBe(2);
  });
});

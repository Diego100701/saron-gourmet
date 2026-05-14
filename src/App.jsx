import { useState, useEffect, useCallback } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy
} from "firebase/firestore";

// ─── Firebase ────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDkxiTQXfeEt5oUt3SFvtmJR-vW15iXsM0",
  authDomain: "saron-entrega.firebaseapp.com",
  databaseURL: "https://saron-entrega-default-rtdb.firebaseio.com",
  projectId: "saron-entrega",
  storageBucket: "saron-entrega.firebasestorage.app",
  messagingSenderId: "177279726416",
  appId: "1:177279726416:web:6ea470a7e7c4b8a7613255",
  measurementId: "G-M55VLLMNMP"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── Credenciais do painel ────────────────────────────────────────────────────
const ADMIN_USER = "Diego12";
const ADMIN_PASS = "Diego@12";

// ─── Motoboy ─────────────────────────────────────────────────────────────────
const MOTOBOY = { name: "Diego", phone: "(86) 99496-3725" };

// ─── Cardápio padrão (seed) ───────────────────────────────────────────────────
const defaultMenuData = {
  "Dindins Clássicos": [
    { name: "Creme de Amendoim com Chocolate", desc: "Sabor intenso e cremosidade do creme de amendoim harmonizado com chocolate rico e aveludado que derrete na boca.", price: 6.50, emoji: "🍫" },
    { name: "Mousse de Limão", desc: "Delicioso e cremoso mousse com a refrescância do limão.", price: 6.50, emoji: "🍋" },
    { name: "Bombom de Castanha", desc: "Combinação perfeita de sabor e crocância! Base cremosa, recheado com castanha e finalizado com chocolate cremoso.", price: 6.00, emoji: "🌰" },
    { name: "Coco Cremoso", desc: "Feito com leite de coco fresco e pedaços generosos de coco ralado. Refrescante e irresistível.", price: 6.50, emoji: "🥥" },
    { name: "Tapioca com Coco", desc: "Clássico nordestino em versão gelada e super cremosa! Feito com tapioca granulada e coco.", price: 6.50, emoji: "🤍" },
    { name: "Pavê de Chocolate", desc: "A clássica sobremesa de família se transforma em um delicioso dindin gourmet.", price: 6.00, emoji: "🍮" },
    { name: "Creme de Amendoim", desc: "Delicioso e cremoso com uma base irresistível de creme de amendoim.", price: 6.50, emoji: "🥜" },
    { name: "Morango com Chocolate", desc: "Combina a frescura dos morangos com a riqueza do chocolate. Equilíbrio perfeito entre os sabores.", price: 6.50, emoji: "🍓" },
  ],
  "Dindins Premium": [
    { name: "Ninho com Chocolate", desc: "Combinação perfeita do nosso creme Ninho com chocolate. TOP 1 dos mais pedidos!", price: 6.50, emoji: "⭐", featured: true },
    { name: "Doce de Leite", desc: "O doce brasileiro mais tradicional em sua forma gelada e extremamente cremosa.", price: 6.00, emoji: "🍯" },
    { name: "Morango com Nutella", desc: "Irresistível combinação que une o frescor do morango com a cremosidade da Nutella.", price: 6.50, emoji: "🍓" },
    { name: "Ninho Trufado", desc: "Delicioso creme Ninho revestido com uma irresistível casquinha de chocolate nobre.", price: 6.50, emoji: "✨" },
    { name: "Ninho com Oreo", desc: "Combinação perfeita do nosso creme Ninho com o delicioso biscoito Oreo.", price: 6.50, emoji: "🖤" },
    { name: "Chocolate Belga", desc: "O mais sofisticado chocolate com um toque meio amargo completa essa deliciosa sobremesa.", price: 6.50, emoji: "🍫" },
    { name: "Mousse de Maracujá", desc: "Verdadeiro mousse com toda refrescância e sabor do maracujá. Cremoso e azedinho na medida certa.", price: 6.50, emoji: "🌺" },
    { name: "Delícia de Abacaxi", desc: "Sobremesa deliciosa, refrescante e super cremosa, com pedaços de abacaxi.", price: 6.50, emoji: "🍍" },
  ],
  "Dindins Supreme": [
    { name: "Chocolate Alpino", desc: "O irresistível bombom ALPINO em dindin gourmet.", price: 7.00, emoji: "🏔️", featured: true },
    { name: "Snickers", desc: "Inspirado no SNICKERS: base de doce de leite e chocolate com caramelo, amendoim e casquinha crocante.", price: 6.50, emoji: "🍬" },
    { name: "Pavê de Brownie com Ovomaltine", desc: "Base cremosa, pedaços de brownie e cobertura crocante de Ovomaltine.", price: 7.00, emoji: "🤎" },
    { name: "Duo", desc: "Textura macia que derrete na boca, combinando chocolate ao leite e chocolate branco.", price: 7.00, emoji: "🤍" },
    { name: "Tortinha de Limão", desc: "Deliciosa tortinha de limão gelada.", price: 6.00, emoji: "🍋" },
    { name: "Maracujá com Chocolate", desc: "Azedinho do maracujá e camada generosa de chocolate cremoso.", price: 7.00, emoji: "🌺" },
    { name: "Pavê de Brownie com Nutella", desc: "Base de Ninho, pedaços de brownie macio e Nutella que derrete na boca.", price: 7.50, emoji: "💛" },
    { name: "Paçoca com Nutella", desc: "Base de doce de amendoim e paçoca com recheio perfeito de creme de Nutella.", price: 6.00, emoji: "🥜" },
    { name: "Ninho com Nutella", desc: "Combinação perfeita do creme Ninho com irresistível camada de Nutella.", price: 7.00, emoji: "💛", featured: true },
    { name: "Ninho com Morango", desc: "Creme Ninho com incrível geleia de morango artesanal.", price: 6.50, emoji: "🍓" },
    { name: "Mousse de Maracujá Trufado", desc: "Mousse de maracujá cremoso e azedinho envolvido de casquinha de chocolate nobre.", price: 7.00, emoji: "🌺" },
    { name: "Romeu e Julieta", desc: "Casal perfeito! Cream cheese com deliciosa goiabada.", price: 6.50, emoji: "❤️" },
    { name: "Laka Oreo", desc: "Chocolate Laka com gotas de Oreo, dando aquele toque crocante.", price: 7.00, emoji: "🖤" },
    { name: "Ouro Branco", desc: "O clássico bombom Ouro Branco chegou pra conquistar o seu espaço.", price: 7.00, emoji: "⚪", featured: true },
    { name: "Caramelito", desc: "Doce de leite e chocolate nobre com casquinha crocante e pedacinhos de caramelo salgado.", price: 6.50, emoji: "🍮" },
    { name: "Ferrero Rocher", desc: "Inspirado no bombom italiano com avelã e amendoim.", price: 7.00, emoji: "🌰", featured: true },
    { name: "Tablito", desc: "Casquinha crocante de chocolate branco com amendoim, base de baunilha.", price: 7.00, emoji: "🍫" },
    { name: "Prestígio", desc: "Cremosidade do chocolate ao leite com o sabor tropical do coco.", price: 7.00, emoji: "🥥" },
    { name: "Pudim", desc: "O clássico pudim de leite em dindin gourmet.", price: 7.00, emoji: "🍮" },
    { name: "Mousse de Maracujá com Nutella", desc: "Combinação perfeita do mousse de maracujá com a irresistível Nutella.", price: 7.00, emoji: "💛" },
  ],
  "Gelatos Gourmet": [
    { name: "Gelato Ninho com Frutas Vermelhas", desc: "Cremoso sorvete de leite Ninho com calda de frutas vermelhas.", price: 8.00, emoji: "🍓", featured: true },
    { name: "Gelato Creme com Passas", desc: "Sorvete cremoso de creme combinado com passas selecionadas.", price: 7.50, emoji: "🍇" },
    { name: "Gelato Maracujá com Chocolate", desc: "Cremoso e refrescante, com sabor marcante do maracujá e intensidade do chocolate.", price: 7.00, emoji: "🌺" },
    { name: "Gelato Ninho Trufado", desc: "Sorvete de Ninho com cobertura especial de chocolate nobre.", price: 7.00, emoji: "✨" },
    { name: "Gelato Morango com Chocolate", desc: "Sorvete de morango suave com camada generosa de chocolate cremoso.", price: 7.00, emoji: "🍓" },
    { name: "Gelato Romeu e Julieta", desc: "Sorvete cremoso com toque doce e marcante da goiabada.", price: 8.00, emoji: "❤️" },
    { name: "Gelato Pudim", desc: "Cremoso e irresistível com doçura equilibrada do leite condensado.", price: 7.00, emoji: "🍮" },
    { name: "Gelato Ninho com Morango", desc: "Delicado e impossível de resistir. Suavidade do leite em pó com sabor do morango.", price: 8.00, emoji: "🍓" },
    { name: "Gelato Ninho com Nutella", desc: "Sorvete de Ninho com a irresistível Nutella. Mistura perfeita que derrete na boca.", price: 8.00, emoji: "💛", featured: true },
    { name: "Gelato Flocos", desc: "Cremoso e leve com pedacinhos de chocolate que derretem na boca.", price: 7.50, emoji: "🤍" },
    { name: "Gelato Ninho com Chocolate", desc: "Combinação irresistível do cremoso Ninho com delicioso chocolate.", price: 7.50, emoji: "🍫" },
    { name: "Gelato Ouro Branco", desc: "Sorvete de Ninho com pedaços de Ouro Branco.", price: 7.50, emoji: "⚪" },
    { name: "Gelato Ferrero Rocher", desc: "Super cremoso com sabor intenso de avelã e amendoim crocantes.", price: 7.50, emoji: "🌰" },
    { name: "Gelato Chocolate", desc: "Cremoso de chocolate com sabor intenso e recheio de brigadeiro.", price: 6.50, emoji: "🍫" },
  ],
  "Bolos": [
    { name: "Bolo Vulcão P", desc: "Serve até 3 pessoas. Massa à escolha, recheio de Ninho ou chocolate.", price: 16.00, emoji: "🌋", featured: true },
    { name: "Bolo Vulcão M", desc: "Serve até 7 pessoas. Massa à escolha, recheio de Ninho ou chocolate.", price: 32.00, emoji: "🌋" },
    { name: "FATIA Prestígio", desc: "Serve 1 pessoa.", price: 8.50, emoji: "🍰" },
    { name: "FATIA Ouro Branco", desc: "Serve 1 pessoa.", price: 8.00, emoji: "🍰" },
    { name: "FATIA Chocolatudo", desc: "Serve 1 pessoa.", price: 8.50, emoji: "🍰" },
    { name: "FATIA Red Velvet com Morango", desc: "Serve 1 pessoa.", price: 9.00, emoji: "🍰", featured: true },
    { name: "FATIA DUO", desc: "Recheio de chocolate branco e chocolate belga. Serve 1 pessoa.", price: 8.50, emoji: "🍰" },
  ],
  "Sobremesas": [
    { name: "Torta de Limão", desc: "Serve 1 pessoa.", price: 6.00, emoji: "🍋" },
    { name: "Mousse de Limão", desc: "Cremoso mousse de limão.", price: 6.00, emoji: "🍋" },
    { name: "Brownie com Chocolate", desc: "Serve 1 pessoa.", price: 6.00, emoji: "🍫" },
    { name: "Copo Duo", desc: "Chocolate 50% + Brownie + Brigadeiro + Ninho + Bolo.", price: 12.00, emoji: "🥤", featured: true },
    { name: "Brownie com Ninho", desc: "Serve 1 pessoa.", price: 6.00, emoji: "🤍" },
    { name: "Mini Pudim", desc: "Serve 1 pessoa.", price: 5.50, emoji: "🍮" },
    { name: "Bolo no Pote", desc: "Serve 1 pessoa. Escolha: Chocolatudo ou Red Velvet.", price: 6.00, emoji: "🍯" },
    { name: "Brownie no Pote", desc: "Serve 1 pessoa.", price: 6.00, emoji: "🍯" },
  ],
  "Bebidas": [
    { name: "Guaraná 200ml", desc: "Guaraná Antarctica gelado.", price: 2.50, emoji: "🥤" },
    { name: "Pepsi 200ml", desc: "Pepsi gelada.", price: 2.50, emoji: "🥤" },
  ],
  "Combos": [
    { name: "Combo Gourmet", desc: "Vulcão P + Refri 200ml + Pudim + Dindin. Combinação perfeita para a família!", price: 30.00, emoji: "🎁", featured: true },
  ],
};

const orderStatuses = [
  { key: "received", label: "Pedido Recebido", icon: "📋" },
  { key: "confirmed", label: "Confirmado", icon: "✅" },
  { key: "preparing", label: "Em Preparo", icon: "👨‍🍳" },
  { key: "delivery", label: "Saiu para Entrega", icon: "🛵" },
  { key: "delivered", label: "Entregue", icon: "🎉" },
];

const nextStatus = { received: "confirmed", confirmed: "preparing", preparing: "delivery", delivery: "delivered" };

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --gold: #C69214; --gold-dark: #8A5A00; --gold-light: #E8B84B;
    --black: #0F0F0F; --graphite: #1E1E1E; --graphite2: #2A2A2A;
    --cream: #F5E8C7; --champagne: #FFFDF8; --text-muted: #888;
    --border: rgba(198,146,20,0.15);
  }
  .app { font-family: 'Poppins', sans-serif; background: var(--black); color: #fff; min-height: 100vh; }

  /* NAVBAR */
  .navbar { position: sticky; top: 0; z-index: 100; background: rgba(15,15,15,0.97); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); padding: 0 20px; display: flex; align-items: center; gap: 12px; height: 60px; }
  .logo-text { font-family: 'Cinzel', serif; font-size: 18px; color: var(--gold); font-weight: 700; letter-spacing: 2px; cursor: pointer; }
  .logo-sub { font-size: 9px; letter-spacing: 4px; color: var(--text-muted); text-transform: uppercase; display: block; }
  .nav-links { display: flex; gap: 4px; margin-left: auto; }
  .nav-btn { background: none; border: none; color: #aaa; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; font-family: 'Poppins', sans-serif; transition: all 0.2s; }
  .nav-btn:hover { background: rgba(198,146,20,0.1); color: var(--gold); }
  .nav-btn.active { color: var(--gold); }
  .cart-btn { position: relative; background: rgba(198,146,20,0.1); border: 1px solid rgba(198,146,20,0.3); color: var(--gold); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 13px; transition: all 0.2s; }
  .cart-btn:hover { background: rgba(198,146,20,0.2); }
  .cart-badge { position: absolute; top: -6px; right: -6px; background: var(--gold); color: #000; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; }

  /* HERO */
  .hero { background: linear-gradient(135deg, #0F0F0F 0%, #1a1000 50%, #0F0F0F 100%); padding: 48px 20px 40px; text-align: center; border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(198,146,20,0.12) 0%, transparent 70%); }
  .hero-title { font-family: 'Cinzel', serif; font-size: clamp(28px, 5vw, 48px); color: var(--gold); letter-spacing: 4px; position: relative; }
  .hero-sub { font-size: 14px; color: var(--text-muted); letter-spacing: 3px; margin-top: 6px; position: relative; }
  .hero-divider { width: 60px; height: 1px; background: var(--gold); margin: 16px auto; opacity: 0.4; }
  .hero-desc { font-size: 14px; color: #aaa; max-width: 400px; margin: 0 auto; line-height: 1.7; position: relative; }
  .search-bar { max-width: 500px; margin: 20px auto 0; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; padding: 0 16px; gap: 10px; position: relative; }
  .search-bar input { background: none; border: none; outline: none; color: #fff; font-family: 'Poppins', sans-serif; font-size: 14px; flex: 1; padding: 12px 0; }
  .search-bar input::placeholder { color: var(--text-muted); }

  /* DESTAQUES */
  .featured-section { padding: 24px 20px; }
  .section-title { font-family: 'Cinzel', serif; font-size: 16px; color: var(--gold); letter-spacing: 2px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .featured-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
  .featured-scroll::-webkit-scrollbar { display: none; }
  .featured-card { min-width: 160px; max-width: 160px; background: var(--graphite); border: 1px solid var(--border); border-radius: 16px; padding: 16px; cursor: pointer; transition: all 0.3s; flex-shrink: 0; }
  .featured-card:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(198,146,20,0.15); }
  .featured-card .emoji { font-size: 32px; display: block; margin-bottom: 10px; }
  .featured-card .name { font-size: 12px; font-weight: 600; color: #fff; line-height: 1.3; margin-bottom: 4px; }
  .featured-card .price { font-size: 13px; color: var(--gold); font-weight: 600; }
  .featured-badge { background: rgba(198,146,20,0.15); color: var(--gold); font-size: 9px; letter-spacing: 1px; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 6px; }

  /* CATEGORIAS */
  .cats-row { display: flex; gap: 8px; overflow-x: auto; padding: 0 20px 16px; scrollbar-width: none; }
  .cats-row::-webkit-scrollbar { display: none; }
  .cat-pill { flex-shrink: 0; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #aaa; font-family: 'Poppins', sans-serif; font-size: 12px; padding: 6px 14px; border-radius: 20px; cursor: pointer; white-space: nowrap; transition: all 0.2s; }
  .cat-pill.active { background: rgba(198,146,20,0.15); border-color: var(--gold); color: var(--gold); }
  .cat-pill:hover { border-color: rgba(198,146,20,0.5); color: #ccc; }

  /* CARDÁPIO */
  .menu-section { padding: 0 20px 32px; }
  .cat-header { font-family: 'Cinzel', serif; font-size: 14px; color: var(--gold); letter-spacing: 2px; padding: 20px 0 12px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
  .product-card { background: var(--graphite); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 16px; display: flex; align-items: flex-start; gap: 14px; cursor: pointer; transition: all 0.25s; position: relative; }
  .product-card:hover { border-color: rgba(198,146,20,0.4); background: rgba(42,42,42,0.9); }
  .product-card.featured-item { border-color: rgba(198,146,20,0.25); }
  .product-emoji { font-size: 28px; min-width: 44px; height: 44px; background: rgba(198,146,20,0.08); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .product-info { flex: 1; }
  .product-name { font-size: 13px; font-weight: 600; color: #fff; line-height: 1.4; margin-bottom: 4px; }
  .product-desc { font-size: 11px; color: var(--text-muted); line-height: 1.5; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-size: 14px; font-weight: 700; color: var(--gold); }
  .add-btn { background: rgba(198,146,20,0.15); border: 1px solid rgba(198,146,20,0.4); color: var(--gold); width: 28px; height: 28px; border-radius: 8px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .add-btn:hover { background: rgba(198,146,20,0.3); }
  .featured-star { position: absolute; top: 10px; right: 10px; font-size: 10px; color: var(--gold); }

  /* CARRINHO */
  .cart-panel { position: fixed; inset: 0; z-index: 200; display: flex; justify-content: flex-end; }
  .cart-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.7); }
  .cart-drawer { position: relative; width: 100%; max-width: 400px; background: var(--graphite); display: flex; flex-direction: column; border-left: 1px solid var(--border); overflow: hidden; }
  .cart-header { padding: 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .cart-title { font-family: 'Cinzel', serif; font-size: 16px; color: var(--gold); letter-spacing: 2px; }
  .close-btn { background: rgba(255,255,255,0.08); border: none; color: #fff; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 16px; }
  .cart-items { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
  .cart-item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 10px; }
  .cart-item-name { font-size: 12px; font-weight: 500; flex: 1; line-height: 1.4; }
  .cart-item-price { font-size: 12px; color: var(--gold); font-weight: 600; }
  .qty-ctrl { display: flex; align-items: center; gap: 6px; }
  .qty-btn { background: rgba(255,255,255,0.08); border: none; color: #fff; width: 24px; height: 24px; border-radius: 6px; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
  .qty-num { font-size: 12px; font-weight: 600; min-width: 16px; text-align: center; }
  .cart-footer { padding: 16px; border-top: 1px solid var(--border); }
  .cart-total-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; color: #aaa; }
  .cart-total-final { display: flex; justify-content: space-between; padding: 12px 0; border-top: 1px solid var(--border); font-size: 16px; font-weight: 700; color: var(--gold); margin-top: 4px; }
  .checkout-btn { width: 100%; background: var(--gold); color: #000; border: none; padding: 14px; border-radius: 12px; font-family: 'Cinzel', serif; font-size: 14px; letter-spacing: 2px; cursor: pointer; font-weight: 700; transition: all 0.2s; margin-top: 12px; }
  .checkout-btn:hover { background: var(--gold-light); }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: var(--graphite); border: 1px solid var(--border); border-radius: 20px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
  .modal-header { padding: 24px; border-bottom: 1px solid var(--border); }
  .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  .form-group label { display: block; font-size: 11px; letter-spacing: 1px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; }
  .form-group input, .form-group select, .form-group textarea { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-family: 'Poppins', sans-serif; font-size: 13px; padding: 10px 14px; outline: none; transition: border-color 0.2s; }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: rgba(198,146,20,0.5); }
  .form-group select option { background: var(--graphite); }
  .payment-options { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .payment-opt { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px; text-align: center; cursor: pointer; transition: all 0.2s; font-size: 12px; }
  .payment-opt.selected { border-color: var(--gold); background: rgba(198,146,20,0.1); color: var(--gold); }
  .type-options { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .type-opt { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px; text-align: center; cursor: pointer; transition: all 0.2s; font-size: 13px; }
  .type-opt.selected { border-color: var(--gold); background: rgba(198,146,20,0.1); color: var(--gold); }
  .place-order-btn { width: 100%; background: var(--gold); color: #000; border: none; padding: 14px; border-radius: 12px; font-family: 'Cinzel', serif; font-size: 14px; letter-spacing: 2px; cursor: pointer; font-weight: 700; transition: all 0.2s; }
  .place-order-btn:hover { background: var(--gold-light); transform: translateY(-1px); }

  /* RASTREAMENTO */
  .tracking-page { padding: 24px 20px; max-width: 480px; margin: 0 auto; }
  .order-card { background: var(--graphite); border: 1px solid var(--border); border-radius: 20px; padding: 24px; margin-bottom: 20px; }
  .track-header { text-align: center; margin-bottom: 24px; }
  .track-id { font-family: 'Cinzel', serif; font-size: 22px; color: var(--gold); }
  .track-status-text { font-size: 13px; color: #aaa; margin-top: 4px; }
  .progress-bar { display: flex; align-items: center; margin: 20px 0; }
  .progress-step { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 6px; }
  .step-circle { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; font-size: 14px; transition: all 0.5s; }
  .step-circle.done { background: rgba(198,146,20,0.2); border-color: var(--gold); }
  .step-circle.active { background: var(--gold); border-color: var(--gold); animation: pulse 2s infinite; }
  .step-label { font-size: 9px; color: var(--text-muted); text-align: center; max-width: 60px; line-height: 1.3; }
  .step-label.done { color: var(--gold); }
  .progress-line { flex: 1; height: 2px; background: rgba(255,255,255,0.08); margin-bottom: 20px; max-width: 40px; }
  .progress-line.done { background: rgba(198,146,20,0.4); }
  @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(198,146,20,0.4); } 50% { box-shadow: 0 0 0 8px rgba(198,146,20,0); } }
  .eta-card { background: rgba(198,146,20,0.08); border: 1px solid rgba(198,146,20,0.2); border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 12px; margin-top: 16px; }
  .eta-icon { font-size: 24px; }
  .eta-label { font-size: 11px; color: var(--text-muted); }
  .eta-value { font-size: 18px; font-weight: 700; color: var(--gold); }

  /* LOGIN */
  .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--black); padding: 20px; }
  .login-box { background: var(--graphite); border: 1px solid var(--border); border-radius: 24px; padding: 40px 32px; width: 100%; max-width: 380px; }
  .login-logo { text-align: center; margin-bottom: 32px; }
  .login-logo-text { font-family: 'Cinzel', serif; font-size: 22px; color: var(--gold); letter-spacing: 3px; }
  .login-logo-sub { font-size: 10px; color: var(--text-muted); letter-spacing: 3px; margin-top: 4px; }
  .login-title { font-family: 'Cinzel', serif; font-size: 16px; color: #ccc; letter-spacing: 2px; margin-bottom: 24px; text-align: center; }
  .login-form { display: flex; flex-direction: column; gap: 14px; }
  .login-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; color: #fff; font-family: 'Poppins', sans-serif; font-size: 14px; padding: 12px 16px; outline: none; transition: border-color 0.2s; }
  .login-input:focus { border-color: rgba(198,146,20,0.6); }
  .login-btn { width: 100%; background: var(--gold); color: #000; border: none; padding: 14px; border-radius: 12px; font-family: 'Cinzel', serif; font-size: 14px; letter-spacing: 2px; cursor: pointer; font-weight: 700; transition: all 0.2s; margin-top: 6px; }
  .login-btn:hover { background: var(--gold-light); }
  .login-error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; font-size: 12px; padding: 10px 14px; border-radius: 10px; text-align: center; }
  .login-back { text-align: center; margin-top: 16px; }
  .login-back-btn { background: none; border: none; color: var(--text-muted); font-size: 12px; cursor: pointer; font-family: 'Poppins', sans-serif; }
  .login-back-btn:hover { color: var(--gold); }

  /* ADMIN */
  .admin-page { display: flex; height: calc(100vh - 60px); }
  .admin-sidebar { width: 220px; background: var(--graphite); border-right: 1px solid var(--border); padding: 20px 12px; flex-shrink: 0; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
  .admin-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: all 0.2s; font-size: 13px; color: #aaa; }
  .admin-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
  .admin-nav-item.active { background: rgba(198,146,20,0.1); color: var(--gold); }
  .admin-nav-icon { font-size: 16px; }
  .admin-main { flex: 1; overflow-y: auto; padding: 24px; }
  .admin-title { font-family: 'Cinzel', serif; font-size: 20px; color: var(--gold); letter-spacing: 2px; margin-bottom: 24px; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px; }
  .stat-card { background: var(--graphite); border: 1px solid var(--border); border-radius: 14px; padding: 16px; }
  .stat-label { font-size: 11px; color: var(--text-muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
  .stat-value { font-size: 28px; font-weight: 700; color: var(--gold); }
  .stat-sub { font-size: 11px; color: #aaa; margin-top: 4px; }
  .orders-table { background: var(--graphite); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
  .orders-header { display: grid; grid-template-columns: 80px 1fr 1fr 80px 100px 100px; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border); font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
  .orders-row { display: grid; grid-template-columns: 80px 1fr 1fr 80px 100px 100px; gap: 12px; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 12px; align-items: center; transition: background 0.2s; }
  .orders-row:hover { background: rgba(255,255,255,0.03); }
  .status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 600; }
  .status-received { background: rgba(100,100,100,0.2); color: #888; }
  .status-confirmed { background: rgba(59,130,246,0.15); color: #60a5fa; }
  .status-preparing { background: rgba(245,158,11,0.15); color: #fbbf24; }
  .status-delivery { background: rgba(139,92,246,0.15); color: #a78bfa; }
  .status-delivered { background: rgba(16,185,129,0.15); color: #34d399; }
  .order-action-btn { background: rgba(198,146,20,0.1); border: 1px solid rgba(198,146,20,0.3); color: var(--gold); font-size: 10px; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-family: 'Poppins', sans-serif; transition: all 0.2s; white-space: nowrap; }
  .order-action-btn:hover { background: rgba(198,146,20,0.2); }
  .delete-btn-red { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #f87171; font-size: 10px; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-family: 'Poppins', sans-serif; transition: all 0.2s; margin-left: 6px; }
  .delete-btn-red:hover { background: rgba(239,68,68,0.2); }
  .products-admin { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
  .product-admin-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 14px; }
  .product-admin-name { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .product-admin-cat { font-size: 11px; color: var(--text-muted); margin-bottom: 8px; }
  .product-admin-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-admin-price { font-size: 13px; color: var(--gold); font-weight: 700; }
  .product-admin-actions { display: flex; gap: 6px; }
  .edit-btn { background: rgba(255,255,255,0.06); border: none; color: #aaa; width: 26px; height: 26px; border-radius: 6px; cursor: pointer; font-size: 12px; }
  .edit-btn:hover { color: #fff; background: rgba(255,255,255,0.12); }
  .admin-form { background: var(--graphite2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; max-width: 600px; margin-bottom: 24px; }
  .admin-form-title { font-family: 'Cinzel', serif; font-size: 16px; color: var(--gold); margin-bottom: 20px; }
  .admin-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .save-btn { background: var(--gold); color: #000; border: none; padding: 12px 32px; border-radius: 10px; font-family: 'Cinzel', serif; font-size: 13px; letter-spacing: 1px; cursor: pointer; font-weight: 700; margin-top: 16px; transition: all 0.2s; }
  .save-btn:hover { background: var(--gold-light); }
  .tab-bar { display: flex; border-bottom: 1px solid var(--border); margin-bottom: 20px; gap: 0; }
  .tab-btn { background: none; border: none; color: #aaa; padding: 10px 16px; cursor: pointer; font-size: 13px; font-family: 'Poppins', sans-serif; border-bottom: 2px solid transparent; transition: all 0.2s; }
  .tab-btn.active { color: var(--gold); border-bottom-color: var(--gold); }
  .settings-section { max-width: 600px; }
  .settings-card { background: var(--graphite2); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px; margin-bottom: 16px; }
  .settings-card-title { font-size: 13px; font-weight: 600; margin-bottom: 14px; color: #ccc; }

  /* MOTOBOY CARD */
  .motoboy-card { background: rgba(37,211,102,0.06); border: 1px solid rgba(37,211,102,0.2); border-radius: 14px; padding: 16px; display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
  .motoboy-icon { font-size: 28px; }
  .motoboy-label { font-size: 10px; color: #666; letter-spacing: 1px; text-transform: uppercase; }
  .motoboy-name { font-size: 15px; font-weight: 600; color: #fff; margin-top: 2px; }
  .motoboy-phone { font-size: 12px; color: #25d366; margin-top: 2px; }

  /* FOOTER */
  .footer { background: var(--graphite); border-top: 1px solid var(--border); padding: 32px 20px; text-align: center; }
  .footer-logo { font-family: 'Cinzel', serif; font-size: 20px; color: var(--gold); letter-spacing: 3px; margin-bottom: 8px; }
  .footer-info { font-size: 12px; color: var(--text-muted); line-height: 2; }
  .footer-divider { width: 40px; height: 1px; background: var(--border); margin: 16px auto; }
  .whatsapp-btn { display: inline-flex; align-items: center; gap: 8px; background: rgba(37,211,102,0.1); border: 1px solid rgba(37,211,102,0.3); color: #25d366; padding: 8px 18px; border-radius: 20px; font-size: 12px; cursor: pointer; text-decoration: none; transition: all 0.2s; margin-top: 12px; }
  .whatsapp-btn:hover { background: rgba(37,211,102,0.2); }
  .admin-secret-btn { background: none; border: none; color: rgba(255,255,255,0.05); font-size: 10px; cursor: pointer; margin-top: 16px; display: block; margin-left: auto; margin-right: auto; font-family: 'Poppins', sans-serif; transition: color 0.3s; }
  .admin-secret-btn:hover { color: rgba(198,146,20,0.3); }

  /* UTILITÁRIOS */
  .empty-cart { text-align: center; padding: 40px 20px; color: var(--text-muted); }
  .empty-cart-icon { font-size: 48px; margin-bottom: 12px; }
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: rgba(198,146,20,0.15); border: 1px solid rgba(198,146,20,0.4); color: var(--gold); padding: 10px 20px; border-radius: 20px; font-size: 13px; z-index: 1000; animation: slideUp 0.3s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
  .loading-screen { display: flex; align-items: center; justify-content: center; height: 100vh; background: var(--black); flex-direction: column; gap: 16px; }
  .loading-spinner { width: 40px; height: 40px; border: 3px solid rgba(198,146,20,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (max-width: 600px) {
    .orders-header, .orders-row { grid-template-columns: 60px 1fr 60px 80px; }
    .orders-header > :nth-child(3), .orders-row > :nth-child(3),
    .orders-header > :nth-child(6), .orders-row > :nth-child(6) { display: none; }
    .product-grid { grid-template-columns: 1fr; }
    .admin-sidebar { width: 180px; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .admin-form-grid { grid-template-columns: 1fr; }
  }
`;

// ─── Componente de Login ──────────────────────────────────────────────────────
function LoginPage({ onLogin, onBack }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      onLogin();
    } else {
      setError("Usuário ou senha incorretos.");
      setTimeout(() => setError(""), 2500);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <div className="login-logo-text">SARON GOURMET</div>
          <div className="login-logo-sub">Painel Administrativo</div>
        </div>
        <div className="login-title">🔐 Acesso Restrito</div>
        <div className="login-form">
          <input
            className="login-input"
            placeholder="Usuário"
            value={user}
            onChange={e => setUser(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            autoComplete="username"
          />
          <input
            className="login-input"
            type="password"
            placeholder="Senha"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            autoComplete="current-password"
          />
          {error && <div className="login-error">{error}</div>}
          <button className="login-btn" onClick={handleLogin}>ENTRAR</button>
        </div>
        <div className="login-back">
          <button className="login-back-btn" onClick={onBack}>← Voltar ao Cardápio</button>
        </div>
      </div>
    </div>
  );
}

// ─── App Principal ────────────────────────────────────────────────────────────
export default function SaronGourmet() {
  const [page, setPage] = useState("home"); // home | tracking | login | admin
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [toast, setToast] = useState(null);
  const [payment, setPayment] = useState("pix");
  const [orderType, setOrderType] = useState("delivery");
  const [adminTab, setAdminTab] = useState("dashboard");
  const [form, setForm] = useState({ name: "", phone: "", address: "", reference: "", note: "" });

  // Firebase state
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Admin form state
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ name: "", desc: "", price: "", emoji: "", category: "Dindins Clássicos", featured: false });

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "menu"), async (snap) => {
      if (snap.empty) {
        const batch = [];
        Object.entries(defaultMenuData).forEach(([category, items]) => {
          items.forEach(item => {
            batch.push(addDoc(collection(db, "menu"), { ...item, category, active: true }));
          });
        });
        await Promise.all(batch);
      } else {
        setMenuItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    showToast("Status atualizado! ✅");
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Excluir este pedido?")) return;
    await deleteDoc(doc(db, "orders", orderId));
    showToast("Pedido removido!");
  };

  const saveProduct = async () => {
    if (!productForm.name || !productForm.price) { showToast("Preencha nome e preço!"); return; }
    const data = { ...productForm, price: parseFloat(productForm.price), active: true };
    if (editingProduct) {
      await updateDoc(doc(db, "menu", editingProduct), data);
      showToast("Produto atualizado! ✅");
    } else {
      await addDoc(collection(db, "menu"), data);
      showToast("Produto adicionado! ✅");
    }
    setProductForm({ name: "", desc: "", price: "", emoji: "", category: "Dindins Clássicos", featured: false });
    setEditingProduct(null);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Excluir este produto?")) return;
    await deleteDoc(doc(db, "menu", id));
    showToast("Produto removido!");
  };

  const startEdit = (product) => {
    setEditingProduct(product.id);
    setProductForm({ name: product.name, desc: product.desc || "", price: String(product.price), emoji: product.emoji || "", category: product.category, featured: product.featured || false });
    window.scrollTo(0, 0);
  };

  const addToCart = useCallback((product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} adicionado! 🛒`);
  }, [showToast]);

  const updateQty = useCallback((id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  }, []);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const delivery = orderType === "delivery" ? 5.00 : 0;
  const finalTotal = cartTotal + delivery;

  const placeOrder = async () => {
    if (!form.name || !form.phone) { showToast("Preencha nome e telefone!"); return; }
    const orderNum = Math.floor(Math.random() * 9000) + 1000;
    const orderData = {
      orderNum: `#${orderNum}`,
      customer: form.name,
      phone: form.phone,
      address: form.address,
      reference: form.reference,
      note: form.note,
      items: cart.map(i => `${i.name} ×${i.qty}`).join(", "),
      itemsDetail: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      total: finalTotal,
      payment,
      type: orderType,
      status: "received",
      createdAt: serverTimestamp(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    const ref = await addDoc(collection(db, "orders"), orderData);
    setCurrentOrderId(ref.id);
    setCheckoutOpen(false);
    setCartOpen(false);
    setCart([]);
    setForm({ name: "", phone: "", address: "", reference: "", note: "" });
    setPage("tracking");
    showToast("Pedido enviado! 🎉");
  };

  const categories = [...new Set(menuItems.map(i => i.category))];
  const featuredProducts = menuItems.filter(p => p.featured);

  const filteredProducts = menuItems.filter(p => {
    const matchCat = activeCat === "all" || p.category === activeCat;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const groupedFiltered = activeCat === "all" && !search
    ? categories.reduce((acc, cat) => { acc[cat] = menuItems.filter(i => i.category === cat); return acc; }, {})
    : { Results: filteredProducts };

  const currentOrder = orders.find(o => o.id === currentOrderId);
  const trackStepIndex = currentOrder ? orderStatuses.findIndex(s => s.key === currentOrder.status) : -1;

  const todayStr = new Date().toLocaleDateString("pt-BR");
  const todayOrders = orders.filter(o => {
    if (!o.createdAt) return false;
    const d = o.createdAt.toDate ? o.createdAt.toDate() : new Date(o.createdAt);
    return d.toLocaleDateString("pt-BR") === todayStr;
  });
  const todayRevenue = todayOrders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status !== "delivered").length;

  // ── Navegar para admin (exige login) ──
  const goToAdmin = () => {
    if (adminAuthenticated) {
      setPage("admin");
    } else {
      setPage("login");
    }
  };

  if (loading) {
    return (
      <div className="app">
        <style>{styles}</style>
        <div className="loading-screen">
          <div className="loading-spinner" />
          <div style={{ color: "var(--gold)", fontFamily: "Cinzel, serif", letterSpacing: 2 }}>SARON GOURMET</div>
          <div style={{ color: "#666", fontSize: 12 }}>Carregando cardápio...</div>
        </div>
      </div>
    );
  }

  // ── TELA DE LOGIN ──
  if (page === "login") {
    return (
      <div className="app">
        <style>{styles}</style>
        <LoginPage
          onLogin={() => { setAdminAuthenticated(true); setPage("admin"); }}
          onBack={() => setPage("home")}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <style>{styles}</style>

      {/* NAVBAR — sem link admin visível */}
      <nav className="navbar">
        <div style={{ cursor: "pointer" }} onClick={() => setPage("home")}>
          <span className="logo-text">SARON</span>
          <span className="logo-sub">Gourmet</span>
        </div>
        <div className="nav-links">
          <button className={`nav-btn ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>Cardápio</button>
          <button className={`nav-btn ${page === "tracking" ? "active" : ""}`} onClick={() => setPage("tracking")}>Rastrear Pedido</button>
          {adminAuthenticated && (
            <button className={`nav-btn ${page === "admin" ? "active" : ""}`} onClick={() => setPage("admin")}>Painel</button>
          )}
        </div>
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          🛒 Carrinho
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </nav>

      {/* ── HOME ── */}
      {page === "home" && (
        <>
          <div className="hero">
            <h1 className="hero-title">SARON GOURMET</h1>
            <span className="hero-sub">Altos · Piauí</span>
            <div className="hero-divider" />
            <p className="hero-desc">Dindins gourmet, gelatos artesanais e sobremesas premium. Sabor que derrete na boca.</p>
            <div className="search-bar">
              <span>🔍</span>
              <input placeholder="Buscar produto..." value={search} onChange={e => { setSearch(e.target.value); setActiveCat("all"); }} />
              {search && <button style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onClick={() => setSearch("")}>✕</button>}
            </div>
          </div>

          {!search && featuredProducts.length > 0 && (
            <div className="featured-section">
              <div className="section-title">⭐ Destaques</div>
              <div className="featured-scroll">
                {featuredProducts.map(p => (
                  <div key={p.id} className="featured-card" onClick={() => addToCart(p)}>
                    <span className="featured-badge">PREMIUM</span>
                    <span className="emoji">{p.emoji}</span>
                    <div className="name">{p.name}</div>
                    <div className="price">R$ {Number(p.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="cats-row">
            <button className={`cat-pill ${activeCat === "all" ? "active" : ""}`} onClick={() => setActiveCat("all")}>Todos</button>
            {categories.map(c => (
              <button key={c} className={`cat-pill ${activeCat === c ? "active" : ""}`} onClick={() => setActiveCat(c)}>{c}</button>
            ))}
          </div>

          <div className="menu-section">
            {Object.entries(groupedFiltered).map(([cat, items]) => (
              items.length > 0 && (
                <div key={cat}>
                  {cat !== "Results" && <div className="cat-header">{cat}</div>}
                  <div className="product-grid">
                    {items.map(p => (
                      <div key={p.id} className={`product-card ${p.featured ? "featured-item" : ""}`} onClick={() => addToCart(p)}>
                        {p.featured && <span className="featured-star">★</span>}
                        <div className="product-emoji">{p.emoji}</div>
                        <div className="product-info">
                          <div className="product-name">{p.name}</div>
                          <div className="product-desc">{p.desc}</div>
                          <div className="product-footer">
                            <div className="product-price">R$ {Number(p.price).toFixed(2)}</div>
                            <button className="add-btn" onClick={e => { e.stopPropagation(); addToCart(p); }}>+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>

          <footer className="footer">
            <div className="footer-logo">SARON GOURMET</div>
            <div className="footer-divider" />
            <div className="footer-info">
              Rua 12 Q L Casa 110, Altos · Piauí<br />
              Próximo à Panificadora Primavera<br />
              WhatsApp: (86) 98804-1700
            </div>
            <a href="https://wa.me/5586988041700" className="whatsapp-btn">💬 Falar pelo WhatsApp</a>
            {/* Botão oculto para acessar o painel — visível apenas ao passar o mouse */}
            <button className="admin-secret-btn" onClick={goToAdmin}>⚙</button>
          </footer>
        </>
      )}

      {/* ── RASTREAMENTO ── */}
      {page === "tracking" && (
        <div className="tracking-page">
          <div className="order-card">
            <div className="track-header">
              <div style={{ fontSize: 32, marginBottom: 8 }}>🛵</div>
              {currentOrder ? (
                <>
                  <div className="track-id">Pedido {currentOrder.orderNum}</div>
                  <div className="track-status-text">{orderStatuses[trackStepIndex]?.label || "Processando..."}</div>
                </>
              ) : (
                <>
                  <div className="track-id" style={{ fontSize: 16, color: "#aaa" }}>Nenhum pedido ativo</div>
                  <div className="track-status-text">Faça um pedido para rastrear</div>
                </>
              )}
            </div>

            {currentOrder && (
              <>
                <div className="progress-bar">
                  {orderStatuses.map((s, idx) => (
                    <div key={s.key} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <div className="progress-step">
                        <div className={`step-circle ${idx < trackStepIndex ? "done" : idx === trackStepIndex ? "active" : ""}`}>
                          {idx < trackStepIndex ? "✓" : s.icon}
                        </div>
                        <div className={`step-label ${idx <= trackStepIndex ? "done" : ""}`}>{s.label}</div>
                      </div>
                      {idx < orderStatuses.length - 1 && (
                        <div className={`progress-line ${idx < trackStepIndex ? "done" : ""}`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="eta-card">
                  <div className="eta-icon">⏱️</div>
                  <div>
                    <div className="eta-label">Tempo estimado</div>
                    <div className="eta-value">{currentOrder.status === "delivered" ? "Entregue!" : "30 min"}</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: "#888" }}>
                  <div><strong style={{ color: "#ccc" }}>Itens:</strong> {currentOrder.items}</div>
                  <div style={{ marginTop: 4 }}><strong style={{ color: "#ccc" }}>Total:</strong> <span style={{ color: "var(--gold)" }}>R$ {Number(currentOrder.total).toFixed(2)}</span></div>
                </div>
              </>
            )}
          </div>
          {!currentOrder && (
            <button className="place-order-btn" onClick={() => setPage("home")}>Ver Cardápio</button>
          )}
        </div>
      )}

      {/* ── PAINEL ADMIN ── */}
      {page === "admin" && adminAuthenticated && (
        <div className="admin-page">
          <div className="admin-sidebar">
            <div style={{ padding: "4px 12px 16px", borderBottom: "1px solid var(--border)", marginBottom: 8 }}>
              <div style={{ fontSize: 12, fontFamily: "Cinzel, serif", color: "var(--gold)", letterSpacing: 1 }}>SARON</div>
              <div style={{ fontSize: 10, color: "#666" }}>Painel Admin</div>
            </div>
            {[
              { key: "dashboard", icon: "📊", label: "Dashboard" },
              { key: "orders", icon: "📋", label: "Pedidos" },
              { key: "menu", icon: "🍫", label: "Cardápio" },
              { key: "motoboy", icon: "🛵", label: "Motoboy" },
              { key: "settings", icon: "⚙️", label: "Configurações" },
            ].map(item => (
              <div key={item.key} className={`admin-nav-item ${adminTab === item.key ? "active" : ""}`} onClick={() => setAdminTab(item.key)}>
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </div>
            ))}
            <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
              <button
                className="admin-nav-item"
                style={{ width: "100%", color: "#f87171", cursor: "pointer" }}
                onClick={() => { setAdminAuthenticated(false); setPage("home"); }}
              >
                <span className="admin-nav-icon">🚪</span> Sair
              </button>
            </div>
          </div>

          <div className="admin-main">

            {/* DASHBOARD */}
            {adminTab === "dashboard" && (
              <>
                <div className="admin-title">Dashboard</div>
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-label">Vendas Hoje</div><div className="stat-value">R$ {todayRevenue.toFixed(0)}</div><div className="stat-sub">{todayOrders.length} pedidos</div></div>
                  <div className="stat-card"><div className="stat-label">Pedidos Total</div><div className="stat-value">{orders.length}</div><div className="stat-sub">{pendingOrders} em andamento</div></div>
                  <div className="stat-card"><div className="stat-label">Ticket Médio</div><div className="stat-value">R$ {orders.length ? (orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length).toFixed(0) : "0"}</div></div>
                  <div className="stat-card"><div className="stat-label">Produtos Ativos</div><div className="stat-value">{menuItems.length}</div><div className="stat-sub">{categories.length} categorias</div></div>
                </div>
                <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 13, color: "#aaa", marginBottom: 16 }}>📋 Últimos Pedidos</div>
                  {orders.slice(0, 5).map((o, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12 }}>
                      <div style={{ color: "var(--gold)", fontWeight: 600, width: 60 }}>{o.orderNum}</div>
                      <div style={{ flex: 1 }}>{o.customer}</div>
                      <span className={`status-badge status-${o.status}`}>{o.status === "received" ? "Recebido" : o.status === "confirmed" ? "Confirmado" : o.status === "preparing" ? "Preparando" : o.status === "delivery" ? "Entrega" : "Entregue"}</span>
                      <div style={{ color: "var(--gold)", fontWeight: 600 }}>R$ {Number(o.total).toFixed(2)}</div>
                    </div>
                  ))}
                  {orders.length === 0 && <div style={{ color: "#666", fontSize: 12, textAlign: "center", padding: 20 }}>Nenhum pedido ainda</div>}
                </div>
              </>
            )}

            {/* PEDIDOS */}
            {adminTab === "orders" && (
              <>
                <div className="admin-title">Pedidos em Tempo Real</div>
                <div className="orders-table">
                  <div className="orders-header">
                    <span>Pedido</span><span>Cliente</span><span>Itens</span><span>Total</span><span>Status</span><span>Ação</span>
                  </div>
                  {orders.length === 0 && (
                    <div style={{ padding: 32, textAlign: "center", color: "#666", fontSize: 13 }}>Nenhum pedido ainda. Aguardando...</div>
                  )}
                  {orders.map(order => (
                    <div key={order.id} className="orders-row">
                      <div style={{ color: "var(--gold)", fontWeight: 600, fontSize: 12 }}>{order.orderNum}</div>
                      <div>
                        <div style={{ fontSize: 12 }}>{order.customer}</div>
                        <div style={{ fontSize: 10, color: "#666" }}>{order.time} · {order.type === "delivery" ? "🛵" : "🏪"}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.items}</div>
                      <div style={{ color: "var(--gold)", fontWeight: 600 }}>R$ {Number(order.total).toFixed(2)}</div>
                      <div>
                        <span className={`status-badge status-${order.status}`}>
                          {order.status === "received" ? "Recebido" : order.status === "confirmed" ? "Confirmado" : order.status === "preparing" ? "Preparando" : order.status === "delivery" ? "Entrega" : "Entregue"}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 4 }}>
                        {order.status !== "delivered" && (
                          <button className="order-action-btn" onClick={() => updateOrderStatus(order.id, nextStatus[order.status])}>
                            Avançar →
                          </button>
                        )}
                        <button className="delete-btn-red" onClick={() => deleteOrder(order.id)}>🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* CARDÁPIO */}
            {adminTab === "menu" && (
              <>
                <div className="admin-title">Gerenciar Cardápio</div>
                <div className="admin-form">
                  <div className="admin-form-title">{editingProduct ? "✏️ Editar Produto" : "➕ Novo Produto"}</div>
                  <div className="admin-form-grid">
                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                      <label>Nome do Produto *</label>
                      <input placeholder="Ex: Ninho com Nutella" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                      <label>Descrição</label>
                      <input placeholder="Descrição do produto" value={productForm.desc} onChange={e => setProductForm({ ...productForm, desc: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Preço (R$) *</label>
                      <input type="number" step="0.50" placeholder="6.50" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Emoji</label>
                      <input placeholder="🍫" value={productForm.emoji} onChange={e => setProductForm({ ...productForm, emoji: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label>Categoria</label>
                      <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                        {["Dindins Clássicos", "Dindins Premium", "Dindins Supreme", "Gelatos Gourmet", "Bolos", "Sobremesas", "Bebidas", "Combos"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 24 }}>
                      <input type="checkbox" id="featured" checked={productForm.featured} onChange={e => setProductForm({ ...productForm, featured: e.target.checked })} style={{ width: "auto" }} />
                      <label htmlFor="featured" style={{ marginBottom: 0, cursor: "pointer" }}>Destaque ⭐</label>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="save-btn" onClick={saveProduct}>{editingProduct ? "Salvar Alterações" : "Adicionar Produto"}</button>
                    {editingProduct && (
                      <button className="save-btn" style={{ background: "rgba(255,255,255,0.1)", color: "#aaa" }} onClick={() => { setEditingProduct(null); setProductForm({ name: "", desc: "", price: "", emoji: "", category: "Dindins Clássicos", featured: false }); }}>
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
                <div className="products-admin">
                  {menuItems.map(p => (
                    <div key={p.id} className="product-admin-card">
                      <div className="product-admin-name">{p.emoji} {p.name}</div>
                      <div className="product-admin-cat">{p.category}</div>
                      <div className="product-admin-footer">
                        <div className="product-admin-price">R$ {Number(p.price).toFixed(2)}</div>
                        <div className="product-admin-actions">
                          <button className="edit-btn" onClick={() => startEdit(p)}>✏️</button>
                          <button className="edit-btn" style={{ color: "#f87171" }} onClick={() => deleteProduct(p.id)}>🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* MOTOBOY */}
            {adminTab === "motoboy" && (
              <>
                <div className="admin-title">Motoboy</div>
                <div className="motoboy-card">
                  <div className="motoboy-icon">🛵</div>
                  <div>
                    <div className="motoboy-label">Motoboy Responsável</div>
                    <div className="motoboy-name">{MOTOBOY.name}</div>
                    <div className="motoboy-phone">📞 {MOTOBOY.phone}</div>
                  </div>
                  <a
                    href={`https://wa.me/55${MOTOBOY.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: "auto", background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.3)", color: "#25d366", padding: "8px 14px", borderRadius: 10, fontSize: 12, textDecoration: "none" }}
                  >
                    💬 WhatsApp
                  </a>
                </div>
                <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 13, color: "#aaa", marginBottom: 16 }}>📦 Pedidos em Entrega</div>
                  {orders.filter(o => o.status === "delivery").length === 0 && (
                    <div style={{ color: "#666", fontSize: 12, textAlign: "center", padding: 20 }}>Nenhum pedido em rota no momento.</div>
                  )}
                  {orders.filter(o => o.status === "delivery").map(o => (
                    <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 12 }}>
                      <div style={{ color: "var(--gold)", fontWeight: 600, width: 60 }}>{o.orderNum}</div>
                      <div style={{ flex: 1 }}>
                        <div>{o.customer}</div>
                        <div style={{ fontSize: 10, color: "#666" }}>{o.address}</div>
                      </div>
                      <span className="status-badge status-delivery">🛵 Em rota</span>
                      <button className="order-action-btn" onClick={() => updateOrderStatus(o.id, "delivered")}>Entregar ✓</button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* CONFIGURAÇÕES */}
            {adminTab === "settings" && (
              <>
                <div className="admin-title">Configurações</div>
                <div className="settings-section">
                  <div className="settings-card">
                    <div className="settings-card-title">📍 Dados da Empresa</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div className="form-group"><label>Nome da Empresa</label><input defaultValue="Saron Gourmet" /></div>
                      <div className="form-group"><label>WhatsApp</label><input defaultValue="86988041700" /></div>
                      <div className="form-group"><label>Endereço</label><input defaultValue="Rua 12 Q L Casa 110, Altos - PI" /></div>
                    </div>
                  </div>
                  <div className="settings-card">
                    <div className="settings-card-title">🚚 Entrega</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div className="form-group"><label>Taxa de Entrega</label><input defaultValue="5,00" /></div>
                      <div className="form-group"><label>Tempo Estimado (min)</label><input defaultValue="30" /></div>
                    </div>
                  </div>
                  <div className="settings-card">
                    <div className="settings-card-title">🔐 Acesso ao Painel</div>
                    <div style={{ fontSize: 12, color: "#666", lineHeight: 1.8 }}>
                      <div>Usuário: <span style={{ color: "#aaa" }}>Diego12</span></div>
                      <div>Para alterar a senha, edite o arquivo App.jsx.</div>
                    </div>
                  </div>
                  <button className="save-btn">Salvar Configurações</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── CARRINHO ── */}
      {cartOpen && (
        <div className="cart-panel">
          <div className="cart-backdrop" onClick={() => setCartOpen(false)} />
          <div className="cart-drawer">
            <div className="cart-header">
              <div className="cart-title">MEU CARRINHO</div>
              <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🛒</div>
                  <div>Carrinho vazio</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Adicione produtos do cardápio</div>
                </div>
              ) : cart.map(item => (
                <div key={item.id} className="cart-item">
                  <span style={{ fontSize: 20 }}>{item.emoji}</span>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                  <div className="cart-item-price">R$ {(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total-row"><span>Subtotal</span><span>R$ {cartTotal.toFixed(2)}</span></div>
                <div className="cart-total-row"><span>Entrega</span><span>{orderType === "delivery" ? "R$ 5,00" : "Grátis"}</span></div>
                <div className="cart-total-final"><span>Total</span><span>R$ {finalTotal.toFixed(2)}</span></div>
                <button className="checkout-btn" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>FINALIZAR PEDIDO</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CHECKOUT ── */}
      {checkoutOpen && (
        <div className="modal-overlay" onClick={() => setCheckoutOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ fontFamily: "Cinzel, serif", fontSize: 18, color: "var(--gold)", letterSpacing: 2 }}>FINALIZAR PEDIDO</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>Preencha seus dados</div>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tipo do Pedido</label>
                <div className="type-options">
                  <div className={`type-opt ${orderType === "delivery" ? "selected" : ""}`} onClick={() => setOrderType("delivery")}>🛵 Entrega</div>
                  <div className={`type-opt ${orderType === "pickup" ? "selected" : ""}`} onClick={() => setOrderType("pickup")}>🏪 Retirada</div>
                </div>
              </div>
              <div className="form-group"><label>Seu Nome *</label><input placeholder="Nome completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="form-group"><label>WhatsApp *</label><input placeholder="(86) 9xxxx-xxxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              {orderType === "delivery" && (
                <>
                  <div className="form-group"><label>Endereço de Entrega</label><input placeholder="Rua, número, bairro" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                  <div className="form-group"><label>Referência</label><input placeholder="Próximo a..." value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} /></div>
                </>
              )}
              <div className="form-group">
                <label>Forma de Pagamento</label>
                <div className="payment-options">
                  {[["pix", "💸 Pix"], ["card", "💳 Cartão"], ["cash", "💵 Dinheiro"], ["mercadopago", "🛒 Mercado Pago"]].map(([k, l]) => (
                    <div key={k} className={`payment-opt ${payment === k ? "selected" : ""}`} onClick={() => setPayment(k)}>{l}</div>
                  ))}
                </div>
              </div>
              <div className="form-group"><label>Observação</label><textarea placeholder="Alguma observação especial?" rows={2} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} style={{ resize: "vertical" }} /></div>
              <div style={{ background: "rgba(198,146,20,0.08)", border: "1px solid rgba(198,146,20,0.2)", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#aaa", marginBottom: 6 }}><span>Subtotal</span><span>R$ {cartTotal.toFixed(2)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#aaa", marginBottom: 8 }}><span>Taxa de entrega</span><span>{orderType === "delivery" ? "R$ 5,00" : "Grátis"}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: "var(--gold)" }}><span>Total</span><span>R$ {finalTotal.toFixed(2)}</span></div>
              </div>
              <button className="place-order-btn" onClick={placeOrder}>✅ CONFIRMAR PEDIDO · R$ {finalTotal.toFixed(2)}</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

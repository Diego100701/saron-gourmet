import { useState, useEffect, useCallback } from "react";

const GOLD = "#C69214";
const GOLD_DARK = "#8A5A00";
const BLACK = "#0F0F0F";
const GRAPHITE = "#1E1E1E";
const CREAM = "#F5E8C7";
const CHAMPAGNE = "#FFFDF8";

const menuData = {
  "Dindins Clássicos": [
    { id: 1, name: "Creme de Amendoim com Chocolate", desc: "Sabor intenso e cremosidade do creme de amendoim harmonizado com chocolate rico e aveludado que derrete na boca.", price: 6.50, emoji: "🍫" },
    { id: 2, name: "Mousse de Limão", desc: "Delicioso e cremoso mousse com a refrescância do limão.", price: 6.50, emoji: "🍋" },
    { id: 3, name: "Bombom de Castanha", desc: "Combinação perfeita de sabor e crocância! Base cremosa, recheado com castanha e finalizado com chocolate cremoso.", price: 6.00, emoji: "🌰" },
    { id: 4, name: "Coco Cremoso", desc: "Feito com leite de coco fresco e pedaços generosos de coco ralado. Refrescante e irresistível.", price: 6.50, emoji: "🥥" },
    { id: 5, name: "Tapioca com Coco", desc: "Clássico nordestino em versão gelada e super cremosa! Feito com tapioca granulada e coco.", price: 6.50, emoji: "🤍" },
    { id: 6, name: "Pavê de Chocolate", desc: "A clássica sobremesa de família se transforma em um delicioso dindin gourmet.", price: 6.00, emoji: "🍮" },
    { id: 7, name: "Creme de Amendoim", desc: "Delicioso e cremoso com uma base irresistível de creme de amendoim.", price: 6.50, emoji: "🥜" },
    { id: 8, name: "Morango com Chocolate", desc: "Combina a frescura dos morangos com a riqueza do chocolate. Equilíbrio perfeito entre os sabores.", price: 6.50, emoji: "🍓" },
  ],
  "Dindins Premium": [
    { id: 9, name: "Ninho com Chocolate", desc: "Combinação perfeita do nosso creme Ninho com chocolate. TOP 1 dos mais pedidos!", price: 6.50, emoji: "⭐", featured: true },
    { id: 10, name: "Doce de Leite", desc: "O doce brasileiro mais tradicional em sua forma gelada e extremamente cremosa.", price: 6.00, emoji: "🍯" },
    { id: 11, name: "Morango com Nutella", desc: "Irresistível combinação que une o frescor do morango com a cremosidade da Nutella. Refrescante e indulgente.", price: 6.50, emoji: "🍓" },
    { id: 12, name: "Ninho Trufado", desc: "Delicioso creme Ninho revestido com uma irresistível casquinha de chocolate nobre.", price: 6.50, emoji: "✨" },
    { id: 13, name: "Ninho com Oreo", desc: "Combinação perfeita do nosso creme Ninho com o delicioso biscoito Oreo.", price: 6.50, emoji: "🖤" },
    { id: 14, name: "Chocolate Belga", desc: "O mais sofisticado chocolate com um toque meio amargo completa essa deliciosa sobremesa.", price: 6.50, emoji: "🍫" },
    { id: 15, name: "Mousse de Maracujá", desc: "Verdadeiro mousse com toda refrescância e sabor do maracujá. Cremoso e azedinho na medida certa.", price: 6.50, emoji: "🌺" },
    { id: 16, name: "Delícia de Abacaxi", desc: "Sobremesa deliciosa, refrescante e super cremosa, com pedaços de abacaxi.", price: 6.50, emoji: "🍍" },
  ],
  "Dindins Supreme": [
    { id: 17, name: "Chocolate Alpino", desc: "O irresistível bombom ALPINO em dindin gourmet. Recheio cremoso com crocância da casquinha de chocolate.", price: 7.00, emoji: "🏔️", featured: true },
    { id: 18, name: "Snickers", desc: "Inspirado no SNICKERS: base de doce de leite e chocolate com caramelo, amendoim e casquinha crocante de chocolate nobre.", price: 6.50, emoji: "🍬" },
    { id: 19, name: "Pavê de Brownie com Ovomaltine", desc: "Base cremosa, pedaços de brownie e cobertura crocante de Ovomaltine. Uma explosão de sabor.", price: 7.00, emoji: "🤎" },
    { id: 20, name: "Duo", desc: "Textura macia que derrete na boca, combinando chocolate ao leite e chocolate branco.", price: 7.00, emoji: "🤍" },
    { id: 21, name: "Tortinha de Limão", desc: "Deliciosa tortinha de limão gelada.", price: 6.00, emoji: "🍋" },
    { id: 22, name: "Maracujá com Chocolate", desc: "Azedinho do maracujá e camada generosa de chocolate cremoso. Contraste perfeito entre o leve e o indulgente.", price: 7.00, emoji: "🌺" },
    { id: 23, name: "Pavê de Brownie com Nutella", desc: "Base de Ninho, pedaços de brownie macio e Nutella que derrete na boca. Doce na medida certa.", price: 7.50, emoji: "💛" },
    { id: 24, name: "Paçoca com Nutella", desc: "Base de doce de amendoim e paçoca com recheio perfeito de creme de Nutella.", price: 6.00, emoji: "🥜" },
    { id: 25, name: "Ninho com Nutella", desc: "Combinação perfeita do creme Ninho com irresistível camada de Nutella.", price: 7.00, emoji: "💛", featured: true },
    { id: 26, name: "Ninho com Morango", desc: "Creme Ninho com incrível geleia de morango artesanal.", price: 6.50, emoji: "🍓" },
    { id: 27, name: "Mousse de Maracujá Trufado", desc: "Mousse de maracujá cremoso e azedinho envolvido de casquinha de chocolate nobre.", price: 7.00, emoji: "🌺" },
    { id: 28, name: "Romeu e Julieta", desc: "Casal perfeito! Cream cheese com deliciosa goiabada. Agrada até o mais exigente paladar.", price: 6.50, emoji: "❤️" },
    { id: 29, name: "Laka Oreo", desc: "Chocolate Laka com gotas de Oreo, dando aquele toque crocante ao seu paladar.", price: 7.00, emoji: "🖤" },
    { id: 30, name: "Ouro Branco", desc: "O clássico bombom Ouro Branco chegou pra conquistar o seu espaço.", price: 7.00, emoji: "⚪", featured: true },
    { id: 31, name: "Caramelito", desc: "Doce de leite e chocolate nobre com casquinha crocante e pedacinhos de caramelo salgado. Irresistível!", price: 6.50, emoji: "🍮" },
    { id: 32, name: "Ferrero Rocher", desc: "Inspirado no bombom italiano com avelã e amendoim. Base cremosa de chocolate com casquinha crocante e creme de avelã.", price: 7.00, emoji: "🌰", featured: true },
    { id: 33, name: "Tablito", desc: "Casquinha crocante de chocolate branco com amendoim, base de baunilha e barrinha de chocolate ao leite no centro.", price: 7.00, emoji: "🍫" },
    { id: 34, name: "Prestígio", desc: "Cremosidade do chocolate ao leite com o sabor tropical do coco. Textura suave e macia.", price: 7.00, emoji: "🥥" },
    { id: 35, name: "Pudim", desc: "O clássico pudim de leite das sobremesas mais sofisticadas agora em dindin gourmet.", price: 7.00, emoji: "🍮" },
    { id: 36, name: "Mousse de Maracujá com Nutella", desc: "Combinação perfeita do mousse de maracujá com a irresistível Nutella.", price: 7.00, emoji: "💛" },
  ],
  "Gelatos Gourmet": [
    { id: 37, name: "Gelato Ninho com Frutas Vermelhas", desc: "Cremoso sorvete de leite Ninho com calda de frutas vermelhas. Suave, refrescante e muito saboroso.", price: 8.00, emoji: "🍓", featured: true },
    { id: 38, name: "Gelato Creme com Passas", desc: "Sorvete cremoso de creme combinado com passas selecionadas. Sabor tradicional com charme extra.", price: 7.50, emoji: "🍇" },
    { id: 39, name: "Gelato Maracujá com Chocolate", desc: "Cremoso e refrescante, com sabor marcante do maracujá e intensidade do chocolate cremoso.", price: 7.00, emoji: "🌺" },
    { id: 40, name: "Gelato Ninho Trufado", desc: "Sorvete de Ninho com cobertura especial de chocolate nobre.", price: 7.00, emoji: "✨" },
    { id: 41, name: "Gelato Morango com Chocolate", desc: "Sorvete de morango suave com camada generosa de chocolate cremoso.", price: 7.00, emoji: "🍓" },
    { id: 42, name: "Gelato Romeu e Julieta", desc: "Sorvete cremoso com toque doce e marcante da goiabada. Equilíbrio perfeito entre o suave e o doce.", price: 8.00, emoji: "❤️" },
    { id: 43, name: "Gelato Pudim", desc: "Cremoso e irresistível com doçura equilibrada do leite condensado, baunilha e calda de caramelo.", price: 7.00, emoji: "🍮" },
    { id: 44, name: "Gelato Ninho com Morango", desc: "Delicado e impossível de resistir. Suavidade do leite em pó com sabor ácido e refrescante do morango.", price: 8.00, emoji: "🍓" },
    { id: 45, name: "Gelato Ninho com Nutella", desc: "Sorvete de Ninho com a irresistível Nutella. Mistura perfeita que derrete na boca.", price: 8.00, emoji: "💛", featured: true },
    { id: 46, name: "Gelato Flocos", desc: "Cremoso e leve com pedacinhos de chocolate que derretem na boca. Simples, clássico e irresistível.", price: 7.50, emoji: "🤍" },
    { id: 47, name: "Gelato Ninho com Chocolate", desc: "Combinação irresistível do cremoso Ninho com delicioso chocolate. Perfeito para quem ama o equilíbrio.", price: 7.50, emoji: "🍫" },
    { id: 48, name: "Gelato Ouro Branco", desc: "Sorvete de Ninho com pedaços de Ouro Branco. Mistura perfeita de chocolate, crocância e cremosidade.", price: 7.50, emoji: "⚪" },
    { id: 49, name: "Gelato Ferrero Rocher", desc: "Super cremoso com sabor intenso de avelã e amendoim crocantes. Sofisticado e perfeito.", price: 7.50, emoji: "🌰" },
    { id: 50, name: "Gelato Chocolate", desc: "Cremoso de chocolate com sabor intenso e marcante com recheio de brigadeiro.", price: 6.50, emoji: "🍫" },
  ],
  "Bolos": [
    { id: 51, name: "Bolo Vulcão P", desc: "Serve até 3 pessoas. Massa à escolha (chocolate ou branca), recheio de Ninho ou chocolate. Adicional Nutella disponível.", price: 16.00, emoji: "🌋", featured: true },
    { id: 52, name: "Bolo Vulcão M", desc: "Serve até 7 pessoas. Massa à escolha, recheio de Ninho ou chocolate. Adicional Nutella disponível.", price: 32.00, emoji: "🌋" },
    { id: 53, name: "FATIA Prestígio", desc: "Serve 1 pessoa.", price: 8.50, emoji: "🍰" },
    { id: 54, name: "FATIA Ouro Branco", desc: "Serve 1 pessoa.", price: 8.00, emoji: "🍰" },
    { id: 55, name: "FATIA Chocolatudo", desc: "Serve 1 pessoa.", price: 8.50, emoji: "🍰" },
    { id: 56, name: "FATIA Red Velvet com Morango", desc: "Serve 1 pessoa.", price: 9.00, emoji: "🍰", featured: true },
    { id: 57, name: "FATIA DUO", desc: "Recheio de chocolate branco e chocolate belga. Serve 1 pessoa.", price: 8.50, emoji: "🍰" },
  ],
  "Sobremesas": [
    { id: 58, name: "Torta de Limão", desc: "Serve 1 pessoa.", price: 6.00, emoji: "🍋" },
    { id: 59, name: "Mousse de Limão", desc: "Cremoso mousse de limão.", price: 6.00, emoji: "🍋" },
    { id: 60, name: "Brownie com Chocolate", desc: "Serve 1 pessoa.", price: 6.00, emoji: "🍫" },
    { id: 61, name: "Copo Duo", desc: "Chocolate 50% + Brownie + Brigadeiro + Ninho + Bolo.", price: 12.00, emoji: "🥤", featured: true },
    { id: 62, name: "Brownie com Ninho", desc: "Serve 1 pessoa.", price: 6.00, emoji: "🤍" },
    { id: 63, name: "Mini Pudim", desc: "Serve 1 pessoa.", price: 5.50, emoji: "🍮" },
    { id: 64, name: "Bolo no Pote", desc: "Serve 1 pessoa. Escolha: Chocolatudo ou Red Velvet.", price: 6.00, emoji: "🍯" },
    { id: 65, name: "Brownie no Pote", desc: "Serve 1 pessoa.", price: 6.00, emoji: "🍯" },
  ],
  "Bebidas": [
    { id: 66, name: "Guaraná 200ml", desc: "Guaraná Antarctica gelado.", price: 2.50, emoji: "🥤" },
    { id: 67, name: "Pepsi 200ml", desc: "Pepsi gelada.", price: 2.50, emoji: "🥤" },
  ],
  "Combos": [
    { id: 68, name: "Combo Gourmet", desc: "Vulcão P + Refri 200ml + Pudim + Dindin. Combinação perfeita para a família!", price: 30.00, emoji: "🎁", featured: true },
  ],
};

const categories = Object.keys(menuData);
const allProducts = Object.entries(menuData).flatMap(([cat, items]) =>
  items.map(item => ({ ...item, category: cat }))
);

const orderStatuses = [
  { key: "received", label: "Pedido Recebido", icon: "📋" },
  { key: "confirmed", label: "Pedido Confirmado", icon: "✅" },
  { key: "preparing", label: "Em Preparo", icon: "👨‍🍳" },
  { key: "delivery", label: "Saiu para Entrega", icon: "🛵" },
  { key: "delivered", label: "Entregue", icon: "🎉" },
];

const adminOrders = [
  { id: "#0042", customer: "Ana Beatriz", items: "Ferrero Rocher ×2, Ninho com Nutella ×1", total: 21.00, status: "preparing", time: "14:32", type: "delivery" },
  { id: "#0041", customer: "Carlos Eduardo", items: "Gelato Ninho com Frutas ×3, Guaraná ×1", total: 26.50, status: "confirmed", time: "14:28", type: "pickup" },
  { id: "#0040", customer: "Márcia Santos", items: "Combo Gourmet ×1", total: 30.00, status: "delivery", time: "14:10", type: "delivery" },
  { id: "#0039", customer: "Pedro Alves", items: "Bolo Vulcão M ×1, Pudim ×2", total: 46.00, status: "delivered", time: "13:55", type: "delivery" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Poppins:wght@300;400;500;600&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --gold: #C69214;
    --gold-dark: #8A5A00;
    --gold-light: #E8B84B;
    --black: #0F0F0F;
    --graphite: #1E1E1E;
    --graphite2: #2A2A2A;
    --cream: #F5E8C7;
    --champagne: #FFFDF8;
    --text-muted: #888;
    --border: rgba(198,146,20,0.15);
  }

  .app { font-family: 'Poppins', sans-serif; background: var(--black); color: #fff; min-height: 100vh; }
  
  .navbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(15,15,15,0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 20px;
    display: flex; align-items: center; gap: 12px;
    height: 60px;
  }
  .logo-text { font-family: 'Cinzel', serif; font-size: 18px; color: var(--gold); font-weight: 700; letter-spacing: 2px; }
  .logo-sub { font-size: 9px; letter-spacing: 4px; color: var(--text-muted); text-transform: uppercase; display: block; }
  .nav-links { display: flex; gap: 4px; margin-left: auto; }
  .nav-btn { background: none; border: none; color: #aaa; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 13px; font-family: 'Poppins', sans-serif; transition: all 0.2s; }
  .nav-btn:hover { background: rgba(198,146,20,0.1); color: var(--gold); }
  .nav-btn.active { color: var(--gold); }
  .cart-btn { position: relative; background: rgba(198,146,20,0.1); border: 1px solid rgba(198,146,20,0.3); color: var(--gold); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-family: 'Poppins', sans-serif; font-size: 13px; transition: all 0.2s; }
  .cart-btn:hover { background: rgba(198,146,20,0.2); }
  .cart-badge { position: absolute; top: -6px; right: -6px; background: var(--gold); color: #000; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; }
  
  .hero {
    background: linear-gradient(135deg, #0F0F0F 0%, #1a1000 50%, #0F0F0F 100%);
    padding: 48px 20px 40px;
    text-align: center;
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(198,146,20,0.12) 0%, transparent 70%);
  }
  .hero-title { font-family: 'Cinzel', serif; font-size: clamp(28px, 5vw, 48px); color: var(--gold); letter-spacing: 4px; position: relative; }
  .hero-sub { font-size: 14px; color: var(--text-muted); letter-spacing: 3px; margin-top: 6px; position: relative; }
  .hero-divider { width: 60px; height: 1px; background: var(--gold); margin: 16px auto; opacity: 0.4; }
  .hero-desc { font-size: 14px; color: #aaa; max-width: 400px; margin: 0 auto; line-height: 1.7; position: relative; }
  
  .search-bar {
    max-width: 500px; margin: 20px auto 0;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 12px;
    display: flex; align-items: center;
    padding: 0 16px; gap: 10px;
    position: relative;
  }
  .search-bar input {
    background: none; border: none; outline: none;
    color: #fff; font-family: 'Poppins', sans-serif;
    font-size: 14px; flex: 1; padding: 12px 0;
  }
  .search-bar input::placeholder { color: var(--text-muted); }

  .featured-section { padding: 24px 20px; }
  .section-title { font-family: 'Cinzel', serif; font-size: 16px; color: var(--gold); letter-spacing: 2px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  
  .featured-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
  .featured-scroll::-webkit-scrollbar { display: none; }
  
  .featured-card {
    min-width: 160px; max-width: 160px;
    background: var(--graphite);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s;
    flex-shrink: 0;
  }
  .featured-card:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(198,146,20,0.15); }
  .featured-card .emoji { font-size: 32px; display: block; margin-bottom: 10px; }
  .featured-card .name { font-size: 12px; font-weight: 600; color: #fff; line-height: 1.3; margin-bottom: 4px; }
  .featured-card .price { font-size: 13px; color: var(--gold); font-weight: 600; }
  .featured-badge { background: rgba(198,146,20,0.15); color: var(--gold); font-size: 9px; letter-spacing: 1px; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 6px; }
  
  .cats-row { display: flex; gap: 8px; overflow-x: auto; padding: 0 20px 16px; scrollbar-width: none; }
  .cats-row::-webkit-scrollbar { display: none; }
  .cat-pill {
    flex-shrink: 0;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: #aaa; font-family: 'Poppins', sans-serif;
    font-size: 12px; padding: 6px 14px; border-radius: 20px;
    cursor: pointer; white-space: nowrap; transition: all 0.2s;
  }
  .cat-pill.active { background: rgba(198,146,20,0.15); border-color: var(--gold); color: var(--gold); }
  .cat-pill:hover { border-color: rgba(198,146,20,0.5); color: #ccc; }
  
  .menu-section { padding: 0 20px 32px; }
  .cat-header { font-family: 'Cinzel', serif; font-size: 14px; color: var(--gold); letter-spacing: 2px; padding: 20px 0 12px; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
  
  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
  
  .product-card {
    background: var(--graphite);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    padding: 16px;
    display: flex; align-items: flex-start; gap: 14px;
    cursor: pointer; transition: all 0.25s;
    position: relative;
  }
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
  
  .cart-panel {
    position: fixed; inset: 0; z-index: 200;
    display: flex; justify-content: flex-end;
  }
  .cart-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.7); }
  .cart-drawer {
    position: relative; width: 100%; max-width: 400px;
    background: var(--graphite); display: flex; flex-direction: column;
    border-left: 1px solid var(--border);
    overflow: hidden;
  }
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
  
  .modal-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal { background: var(--graphite); border: 1px solid var(--border); border-radius: 20px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }
  .modal-header { padding: 24px; border-bottom: 1px solid var(--border); }
  .modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  
  .form-group label { display: block; font-size: 11px; letter-spacing: 1px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; }
  .form-group input, .form-group select, .form-group textarea {
    width: 100%; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
    color: #fff; font-family: 'Poppins', sans-serif; font-size: 13px; padding: 10px 14px;
    outline: none; transition: border-color 0.2s;
  }
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
  
  .products-admin { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
  .product-admin-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 14px; }
  .product-admin-name { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .product-admin-cat { font-size: 11px; color: var(--text-muted); margin-bottom: 8px; }
  .product-admin-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-admin-price { font-size: 13px; color: var(--gold); font-weight: 700; }
  .product-admin-actions { display: flex; gap: 6px; }
  .edit-btn { background: rgba(255,255,255,0.06); border: none; color: #aaa; width: 26px; height: 26px; border-radius: 6px; cursor: pointer; font-size: 12px; }
  .edit-btn:hover { color: #fff; background: rgba(255,255,255,0.12); }
  
  .footer { background: var(--graphite); border-top: 1px solid var(--border); padding: 32px 20px; text-align: center; }
  .footer-logo { font-family: 'Cinzel', serif; font-size: 20px; color: var(--gold); letter-spacing: 3px; margin-bottom: 8px; }
  .footer-info { font-size: 12px; color: var(--text-muted); line-height: 2; }
  .footer-divider { width: 40px; height: 1px; background: var(--border); margin: 16px auto; }
  .whatsapp-btn { display: inline-flex; align-items: center; gap: 8px; background: rgba(37,211,102,0.1); border: 1px solid rgba(37,211,102,0.3); color: #25d366; padding: 8px 18px; border-radius: 20px; font-size: 12px; cursor: pointer; text-decoration: none; transition: all 0.2s; margin-top: 12px; }
  .whatsapp-btn:hover { background: rgba(37,211,102,0.2); }
  
  .empty-cart { text-align: center; padding: 40px 20px; color: var(--text-muted); }
  .empty-cart-icon { font-size: 48px; margin-bottom: 12px; }
  
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: rgba(198,146,20,0.15); border: 1px solid rgba(198,146,20,0.4); color: var(--gold); padding: 10px 20px; border-radius: 20px; font-size: 13px; z-index: 1000; animation: slideUp 0.3s ease; }
  @keyframes slideUp { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
  
  .admin-form { background: var(--graphite2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; max-width: 600px; }
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
  
  @media (max-width: 600px) {
    .orders-header, .orders-row { grid-template-columns: 60px 1fr 60px 80px; }
    .orders-header > :nth-child(2), .orders-row > :nth-child(2), .orders-header > :nth-child(4), .orders-row > :nth-child(4) { display: none; }
    .product-grid { grid-template-columns: 1fr; }
    .admin-sidebar { width: 180px; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
  }
`;

export default function SaronGourmet() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackStep, setTrackStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [payment, setPayment] = useState("pix");
  const [orderType, setOrderType] = useState("delivery");
  const [adminTab, setAdminTab] = useState("dashboard");
  const [adminOrdsLocal, setAdminOrdsLocal] = useState(adminOrders);
  const [form, setForm] = useState({ name: "", phone: "", address: "", reference: "", note: "" });

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

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

  const placeOrder = () => {
    if (!form.name || !form.phone) { showToast("Preencha nome e telefone!"); return; }
    setCheckoutOpen(false);
    setCartOpen(false);
    setCart([]);
    setOrderPlaced(true);
    setTrackStep(1);
    setTrackingOpen(true);
    setPage("tracking");
    let step = 1;
    const iv = setInterval(() => {
      step++;
      setTrackStep(step);
      if (step >= 4) clearInterval(iv);
    }, 6000);
  };

  const filteredProducts = allProducts.filter(p => {
    const matchCat = activeCat === "all" || p.category === activeCat;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredProducts = allProducts.filter(p => p.featured);

  const groupedFiltered = activeCat === "all" && !search
    ? Object.fromEntries(categories.map(cat => [cat, menuData[cat]]))
    : { Results: filteredProducts };

  const statusLabel = orderStatuses[trackStep - 1]?.label || "Processando...";

  const updateOrderStatus = (id, newStatus) => {
    setAdminOrdsLocal(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    showToast(`Pedido ${id} atualizado!`);
  };

  const nextStatus = { received: "confirmed", confirmed: "preparing", preparing: "delivery", delivery: "delivered" };

  return (
    <div className="app">
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div>
          <span className="logo-text">SARON</span>
          <span className="logo-sub">Gourmet</span>
        </div>
        <div className="nav-links">
          <button className={`nav-btn ${page === "home" || page === "menu" ? "active" : ""}`} onClick={() => setPage("home")}>Cardápio</button>
          <button className={`nav-btn ${page === "tracking" ? "active" : ""}`} onClick={() => setPage("tracking")}>Rastrear</button>
          <button className={`nav-btn ${page === "admin" ? "active" : ""}`} onClick={() => setPage("admin")}>Admin</button>
        </div>
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          🛒 Carrinho
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </nav>

      {/* HOME / MENU */}
      {(page === "home" || page === "menu") && (
        <>
          <div className="hero">
            <h1 className="hero-title">SARON GOURMET</h1>
            <span className="hero-sub">Altos · Piauí</span>
            <div className="hero-divider" />
            <p className="hero-desc">Dindins gourmet, gelatos artesanais e sobremesas premium. Sabor que derrete na boca.</p>
            <div className="search-bar">
              <span>🔍</span>
              <input
                placeholder="Buscar produto..."
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveCat("all"); }}
              />
              {search && <button style={{ background: "none", border: "none", color: "#888", cursor: "pointer" }} onClick={() => setSearch("")}>✕</button>}
            </div>
          </div>

          {/* Featured */}
          {!search && (
            <div className="featured-section">
              <div className="section-title">⭐ Destaques</div>
              <div className="featured-scroll">
                {featuredProducts.map(p => (
                  <div key={p.id} className="featured-card" onClick={() => addToCart(p)}>
                    <span className="featured-badge">PREMIUM</span>
                    <span className="emoji">{p.emoji}</span>
                    <div className="name">{p.name}</div>
                    <div className="price">R$ {p.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category pills */}
          <div className="cats-row">
            <button className={`cat-pill ${activeCat === "all" ? "active" : ""}`} onClick={() => setActiveCat("all")}>Todos</button>
            {categories.map(c => (
              <button key={c} className={`cat-pill ${activeCat === c ? "active" : ""}`} onClick={() => setActiveCat(c)}>{c}</button>
            ))}
          </div>

          {/* Menu grid */}
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
                            <div className="product-price">R$ {p.price.toFixed(2)}</div>
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
            <a href="https://wa.me/5586988041700" className="whatsapp-btn">
              💬 Falar pelo WhatsApp
            </a>
          </footer>
        </>
      )}

      {/* TRACKING */}
      {page === "tracking" && (
        <div className="tracking-page">
          <div className="order-card">
            <div className="track-header">
              <div style={{ fontSize: 32, marginBottom: 8 }}>🛵</div>
              {orderPlaced ? (
                <>
                  <div className="track-id">Pedido #0043</div>
                  <div className="track-status-text">{statusLabel}</div>
                </>
              ) : (
                <>
                  <div className="track-id" style={{ fontSize: 16, color: "#aaa" }}>Nenhum pedido ativo</div>
                  <div className="track-status-text">Faça um pedido para rastrear</div>
                </>
              )}
            </div>

            {orderPlaced && (
              <>
                <div className="progress-bar">
                  {orderStatuses.map((s, idx) => (
                    <div key={s.key} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                      <div className="progress-step">
                        <div className={`step-circle ${idx + 1 < trackStep ? "done" : idx + 1 === trackStep ? "active" : ""}`}>
                          {idx + 1 < trackStep ? "✓" : s.icon}
                        </div>
                        <div className={`step-label ${idx + 1 <= trackStep ? "done" : ""}`}>{s.label}</div>
                      </div>
                      {idx < orderStatuses.length - 1 && (
                        <div className={`progress-line ${idx + 1 < trackStep ? "done" : ""}`} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="eta-card">
                  <div className="eta-icon">⏱️</div>
                  <div>
                    <div className="eta-label">Tempo estimado</div>
                    <div className="eta-value">{trackStep < 4 ? `${30 - (trackStep - 1) * 8} min` : "Entregue!"}</div>
                  </div>
                </div>

                {trackStep >= 4 && (
                  <div style={{ marginTop: 16, background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 12, padding: 14, textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>🎉</div>
                    <div style={{ fontSize: 13, color: "#34d399" }}>Seu pedido saiu para entrega!</div>
                    <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Entregador: João Silva · 📱 (86) 99999-0000</div>
                  </div>
                )}
              </>
            )}
          </div>

          {!orderPlaced && (
            <button className="place-order-btn" onClick={() => setPage("home")}>
              Ver Cardápio
            </button>
          )}
        </div>
      )}

      {/* ADMIN */}
      {page === "admin" && (
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
              { key: "delivery", icon: "🛵", label: "Entregadores" },
              { key: "finance", icon: "💰", label: "Financeiro" },
              { key: "settings", icon: "⚙️", label: "Configurações" },
            ].map(item => (
              <div
                key={item.key}
                className={`admin-nav-item ${adminTab === item.key ? "active" : ""}`}
                onClick={() => setAdminTab(item.key)}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>

          <div className="admin-main">
            {adminTab === "dashboard" && (
              <>
                <div className="admin-title">Dashboard</div>
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-label">Vendas Hoje</div><div className="stat-value">R$ 347</div><div className="stat-sub">↑ 18% vs ontem</div></div>
                  <div className="stat-card"><div className="stat-label">Pedidos</div><div className="stat-value">23</div><div className="stat-sub">4 em andamento</div></div>
                  <div className="stat-card"><div className="stat-label">Ticket Médio</div><div className="stat-value">R$ 15</div><div className="stat-sub">este mês</div></div>
                  <div className="stat-card"><div className="stat-label">Produtos Ativos</div><div className="stat-value">{allProducts.length}</div><div className="stat-sub">8 categorias</div></div>
                </div>
                <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: "#aaa", marginBottom: 16 }}>🏆 Mais Vendidos Hoje</div>
                  {[
                    { name: "Ninho com Nutella", qty: 12, revenue: "R$ 84" },
                    { name: "Ferrero Rocher", qty: 9, revenue: "R$ 63" },
                    { name: "Gelato Ninho c/ Frutas", qty: 7, revenue: "R$ 56" },
                    { name: "Combo Gourmet", qty: 5, revenue: "R$ 150" },
                  ].map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <div style={{ width: 24, height: 24, background: "rgba(198,146,20,0.1)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--gold)", fontWeight: 700 }}>{i + 1}</div>
                      <div style={{ flex: 1, fontSize: 13 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{p.qty} und</div>
                      <div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 600 }}>{p.revenue}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {adminTab === "orders" && (
              <>
                <div className="admin-title">Pedidos em Tempo Real</div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {["Todos", "Recebido", "Preparando", "Entrega"].map(f => (
                    <button key={f} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: "Poppins, sans-serif" }}>{f}</button>
                  ))}
                </div>
                <div className="orders-table">
                  <div className="orders-header">
                    <span>Pedido</span>
                    <span>Cliente</span>
                    <span>Itens</span>
                    <span>Total</span>
                    <span>Status</span>
                    <span>Ação</span>
                  </div>
                  {adminOrdsLocal.map(order => (
                    <div key={order.id} className="orders-row">
                      <div style={{ color: "var(--gold)", fontWeight: 600, fontSize: 12 }}>{order.id}</div>
                      <div>
                        <div style={{ fontSize: 12 }}>{order.customer}</div>
                        <div style={{ fontSize: 10, color: "#666" }}>{order.time} · {order.type === "delivery" ? "🛵" : "🏪"}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#888", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.items}</div>
                      <div style={{ color: "var(--gold)", fontWeight: 600 }}>R$ {order.total.toFixed(2)}</div>
                      <div>
                        <span className={`status-badge status-${order.status}`}>
                          {order.status === "received" ? "Recebido" : order.status === "confirmed" ? "Confirmado" : order.status === "preparing" ? "Preparando" : order.status === "delivery" ? "Entrega" : "Entregue"}
                        </span>
                      </div>
                      <div>
                        {order.status !== "delivered" && (
                          <button className="order-action-btn" onClick={() => updateOrderStatus(order.id, nextStatus[order.status])}>
                            Avançar →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {adminTab === "menu" && (
              <>
                <div className="admin-title">Gerenciar Cardápio</div>
                <div className="tab-bar">
                  <button className="tab-btn active">Produtos</button>
                  <button className="tab-btn">Categorias</button>
                  <button className="tab-btn">Complementos</button>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <button className="save-btn">+ Novo Produto</button>
                </div>
                <div className="products-admin">
                  {allProducts.slice(0, 24).map(p => (
                    <div key={p.id} className="product-admin-card">
                      <div className="product-admin-name">{p.emoji} {p.name}</div>
                      <div className="product-admin-cat">{p.category}</div>
                      <div className="product-admin-footer">
                        <div className="product-admin-price">R$ {p.price.toFixed(2)}</div>
                        <div className="product-admin-actions">
                          <button className="edit-btn">✏️</button>
                          <button className="edit-btn">🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {adminTab === "delivery" && (
              <>
                <div className="admin-title">Entregadores</div>
                <div className="admin-form" style={{ marginBottom: 20 }}>
                  <div className="admin-form-title">Cadastrar Entregador</div>
                  <div className="admin-form-grid">
                    <div className="form-group"><label>Nome</label><input placeholder="Nome completo" /></div>
                    <div className="form-group"><label>Telefone</label><input placeholder="(86) 9xxxx-xxxx" /></div>
                    <div className="form-group"><label>Veículo</label><input placeholder="Moto, Bicicleta..." /></div>
                    <div className="form-group"><label>CPF</label><input placeholder="000.000.000-00" /></div>
                  </div>
                  <button className="save-btn">Cadastrar</button>
                </div>
                {[{ name: "João Silva", vehicle: "Moto", status: "active", orders: 3 }].map((d, i) => (
                  <div key={i} style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 44, height: 44, background: "rgba(198,146,20,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{d.vehicle} · {d.orders} entregas hoje</div>
                    </div>
                    <span style={{ background: "rgba(16,185,129,0.1)", color: "#34d399", fontSize: 11, padding: "4px 10px", borderRadius: 20 }}>Ativo</span>
                  </div>
                ))}
              </>
            )}

            {adminTab === "finance" && (
              <>
                <div className="admin-title">Financeiro</div>
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-label">Faturamento Mês</div><div className="stat-value">R$ 4.280</div></div>
                  <div className="stat-card"><div className="stat-label">Pix Recebido</div><div className="stat-value">R$ 2.940</div></div>
                  <div className="stat-card"><div className="stat-label">Cartão</div><div className="stat-value">R$ 840</div></div>
                  <div className="stat-card"><div className="stat-label">Dinheiro</div><div className="stat-value">R$ 500</div></div>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                  <button className="save-btn">📄 Exportar PDF</button>
                  <button className="save-btn" style={{ background: "rgba(198,146,20,0.1)", color: "var(--gold)", border: "1px solid rgba(198,146,20,0.3)" }}>📊 Exportar Excel</button>
                </div>
                <div style={{ background: "var(--graphite)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "#888" }}>Últimas Transações</div>
                  {[
                    { id: "#0043", method: "Pix", value: 21.00, time: "14:32" },
                    { id: "#0042", method: "Cartão", value: 30.00, time: "14:10" },
                    { id: "#0041", method: "Dinheiro", value: 26.50, time: "13:55" },
                    { id: "#0040", method: "Pix", value: 46.00, time: "13:30" },
                  ].map((t, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 13 }}>
                      <div style={{ color: "var(--gold)", fontWeight: 600, width: 50 }}>{t.id}</div>
                      <div style={{ flex: 1 }}>{t.method}</div>
                      <div style={{ color: "#888", fontSize: 11 }}>{t.time}</div>
                      <div style={{ color: "#34d399", fontWeight: 600 }}>+R$ {t.value.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

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
                      <div className="form-group"><label>Referência</label><input defaultValue="Próximo à Panificadora Primavera" /></div>
                    </div>
                  </div>
                  <div className="settings-card">
                    <div className="settings-card-title">🚚 Configurações de Entrega</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div className="form-group"><label>Taxa de Entrega</label><input defaultValue="5,00" /></div>
                      <div className="form-group"><label>Pedido Mínimo</label><input defaultValue="0,00" /></div>
                      <div className="form-group"><label>Tempo Estimado (min)</label><input defaultValue="30" /></div>
                      <div className="form-group"><label>Raio de Entrega (km)</label><input defaultValue="10" /></div>
                    </div>
                  </div>
                  <div className="settings-card">
                    <div className="settings-card-title">🕐 Horário de Funcionamento</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div className="form-group"><label>Abertura</label><input defaultValue="08:00" /></div>
                      <div className="form-group"><label>Fechamento</label><input defaultValue="22:00" /></div>
                    </div>
                  </div>
                  <button className="save-btn">Salvar Configurações</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CART DRAWER */}
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
                <button className="checkout-btn" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>
                  FINALIZAR PEDIDO
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
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
              <button className="place-order-btn" onClick={placeOrder}>
                ✅ CONFIRMAR PEDIDO · R$ {finalTotal.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

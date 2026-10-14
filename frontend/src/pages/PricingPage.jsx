import React from 'react';
import BackButton from '../components/BackButton';

function PricingPage() {
  const handleBuy = (planName) => {
    alert(`Оплата "${planName}" скоро будет доступна! Следите за обновлениями.`);
  };

  const plans = [
    {
      name: 'Старт',
      price: '99 ₽',
      period: '/мес',
      icon: '🚀',
      color: '#00F0FF',
      features: [
        '✅ 10 объявлений в месяц',
        '✅ Срок публикации — 60 дней',
        '✅ Базовая поддержка',
        '✅ Статистика просмотров',
      ],
      cta: 'Выбрать Старт',
    },
    {
      name: 'Бизнес',
      price: '399 ₽',
      period: '/мес',
      icon: '💼',
      color: '#00F0FF',
      popular: true,
      features: [
        '✅ 50 объявлений в месяц',
        '✅ Срок публикации — 60 дней',
        '✅ Загрузка видео к объявлению',
        '✅ Расширенная статистика',
        '✅ Приоритетная поддержка',
      ],
      cta: 'Выбрать Бизнес',
    },
    {
      name: 'Профи',
      price: '999 ₽',
      period: '/мес',
      icon: '👑',
      color: '#FFD700',
      features: [
        '✅ Безлимит объявлений',
        '✅ Срок публикации — 60 дней',
        '✅ VIP-метка на объявлениях',
        '✅ Расширенная аналитика',
        '✅ Персональный менеджер',
      ],
      cta: 'Выбрать Профи',
    },
    {
      name: 'Разово',
      price: '49 ₽',
      period: 'за раз',
      icon: '⚡',
      color: '#00F0FF',
      features: [
        '✅ +1 объявление',
        '✅ +30 дней к публикации',
        '✅ Без подписки',
      ],
      cta: 'Купить разово',
    },
  ];

  return (
    <div className="page-container">
      <BackButton text="На главную" to="/" />

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Тарифы ЗипТап</h1>
        <p style={styles.heroText}>
          Платите только за то, что нужно. Частникам — бесплатно!
        </p>
      </div>

      <div style={styles.grid}>
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              ...styles.card,
              borderColor: plan.popular ? '#00F0FF' : '#e0e0e0',
              boxShadow: plan.popular ? '0 0 25px rgba(0, 240, 255, 0.4)' : 'none',
              transform: plan.popular ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            {plan.popular && (
              <span style={styles.popularBadge}>🔥 Популярный</span>
            )}

            <div style={styles.icon}>{plan.icon}</div>
            <h2 style={styles.planName}>{plan.name}</h2>

            <div style={styles.priceBlock}>
              <span style={{ ...styles.price, color: plan.color }}>{plan.price}</span>
              <span style={styles.period}>{plan.period}</span>
            </div>

            <ul style={styles.features}>
              {plan.features.map((feature, i) => (
                <li key={i} style={styles.feature}>{feature}</li>
              ))}
            </ul>

            <button
              onClick={() => handleBuy(plan.name)}
              style={{
                ...styles.button,
                backgroundColor: plan.popular ? '#00F0FF' : '#1a1a2e',
                color: plan.popular ? '#1a1a2e' : '#fff',
                boxShadow: plan.popular ? '0 0 15px rgba(0, 240, 255, 0.5)' : 'none',
              }}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div style={styles.faq}>
        <h2 style={styles.faqTitle}>Частые вопросы</h2>

        <div style={styles.faqItem}>
          <h3 style={styles.faqQ}>Можно ли размещать объявления бесплатно?</h3>
          <p style={styles.faqA}>
            Да! Частники могут размещать объявления бесплатно — 1 в месяц (2 после верификации).
          </p>
        </div>

        <div style={styles.faqItem}>
          <h3 style={styles.faqQ}>Как работает платёж?</h3>
          <p style={styles.faqA}>
            Оплата банковской картой. Подписка продлевается автоматически, можно отменить в любой момент.
          </p>
        </div>

        <div style={styles.faqItem}>
          <h3 style={styles.faqQ}>Можно ли сменить тариф?</h3>
          <p style={styles.faqA}>
            Да, в любой момент в личном кабинете.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  heroTitle: {
    fontSize: '42px',
    color: '#1a1a2e',
    margin: '0 0 10px',
  },
  heroText: {
    fontSize: '18px',
    color: '#666',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '60px',
  },
  card: {
    backgroundColor: '#fff',
    border: '2px solid #e0e0e0',
    borderRadius: '16px',
    padding: '30px 20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'all 0.3s',
  },
  popularBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#00F0FF',
    color: '#1a1a2e',
    padding: '4px 12px',
    borderRadius: '10px',
    fontSize: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  icon: {
    fontSize: '48px',
    textAlign: 'center',
    marginBottom: '10px',
  },
  planName: {
    fontSize: '22px',
    textAlign: 'center',
    margin: '0 0 15px',
    color: '#1a1a2e',
  },
  priceBlock: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  price: {
    fontSize: '36px',
    fontWeight: 'bold',
  },
  period: {
    fontSize: '16px',
    color: '#888',
    marginLeft: '5px',
  },
  features: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 25px',
    flexGrow: 1,
  },
  feature: {
    padding: '8px 0',
    fontSize: '14px',
    color: '#333',
    borderBottom: '1px solid #f0f0f0',
  },
  button: {
    padding: '14px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  faq: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  faqTitle: {
    fontSize: '28px',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: '30px',
  },
  faqItem: {
    marginBottom: '20px',
    padding: '15px 20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
  },
  faqQ: {
    fontSize: '17px',
    margin: '0 0 8px',
    color: '#1a1a2e',
  },
  faqA: {
    margin: 0,
    color: '#666',
    fontSize: '14px',
  },
};

export default PricingPage;
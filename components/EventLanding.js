'use client';
import { useState, useEffect } from 'react';
import styles from './EventLanding.module.css';
import { FaMusic, FaUsers, FaClock, FaMapMarkerAlt, FaTicketAlt, FaFire, FaSearch } from 'react-icons/fa';

const mockEvents = [
  {
    id: 1,
    name: 'BMS - Indie Music Fest',
    category: 'Concert',
    date: 'Today',
    time: '7:00 PM',
    location: 'Gomti Nagar, Lucknow',
    price: '₹299',
    image: '🎵',
    available: 45,
    trending: true,
  },
  {
    id: 2,
    name: 'Tech Meetup - AI & ML Talk',
    category: 'Meetup',
    date: 'Today',
    time: '5:30 PM',
    location: 'IT Hub, Lucknow',
    price: 'Free',
    image: '💻',
    available: 120,
    trending: true,
  },
  {
    id: 3,
    name: 'Comedy Night Live',
    category: 'Show',
    date: 'Today',
    time: '8:00 PM',
    location: 'Entertainment Complex',
    price: '₹399',
    image: '😂',
    available: 32,
    trending: false,
  },
  {
    id: 4,
    name: 'DJ Party - Dance Night',
    category: 'Party',
    date: 'Today',
    time: '9:00 PM',
    location: 'Club Downtown',
    price: '₹449',
    image: '🎉',
    available: 28,
    trending: true,
  },
  {
    id: 5,
    name: 'Stand-up Comedy - Hilarious Hours',
    category: 'Comedy',
    date: 'Today',
    time: '7:30 PM',
    location: 'Comedy Club, Gomti Nagar',
    price: '₹349',
    image: '🎤',
    available: 15,
    trending: true,
  },
  {
    id: 6,
    name: 'Live Band Performance',
    category: 'Music',
    date: 'Today',
    time: '6:00 PM',
    location: 'Music Venue Central',
    price: '₹499',
    image: '🎸',
    available: 8,
    trending: false,
  },
];

const categories = ['All', 'Concert', 'Show', 'Meetup', 'Party', 'Comedy', 'Music'];

export default function EventLanding() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayEvents, setDisplayEvents] = useState(mockEvents);
  const [bookingConfirm, setBookingConfirm] = useState(null);

  useEffect(() => {
    let filtered = mockEvents;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setDisplayEvents(filtered);
  }, [selectedCategory, searchTerm]);

  const handleBooking = (event) => {
    setBookingConfirm(event);
    setTimeout(() => setBookingConfirm(null), 3000);
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>🎉 Events Today - Book Now!</h1>
          <p>Same-day event booking • Instant confirmation • Best prices</p>
          
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search events, concerts, shows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </section>

      <section className={styles.categorySection}>
        <div className={styles.categoryList}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.active : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.eventsSection}>
        <div className={styles.eventsContainer}>
          {displayEvents.length > 0 ? (
            displayEvents.map(event => (
              <div key={event.id} className={styles.eventCard}>
                {event.trending && <div className={styles.trendingBadge}><FaFire /> Trending</div>}
                {event.available <= 10 && <div className={styles.urgentBadge}>⚡ Almost Full</div>}
                
                <div className={styles.eventImage}>{event.image}</div>
                
                <div className={styles.eventInfo}>
                  <h3>{event.name}</h3>
                  <p className={styles.category}>{event.category}</p>
                  
                  <div className={styles.details}>
                    <div className={styles.detail}>
                      <FaClock /> {event.time}
                    </div>
                    <div className={styles.detail}>
                      <FaMapMarkerAlt /> {event.location}
                    </div>
                  </div>

                  <div className={styles.footer}>
                    <span className={styles.price}>{event.price}</span>
                    <div className={styles.available}>{event.available} seats</div>
                  </div>

                  <button 
                    className={styles.bookBtn}
                    onClick={() => handleBooking(event)}
                  >
                    <FaTicketAlt /> Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noEvents}>
              <p>No events found. Try another search or category.</p>
            </div>
          )}
        </div>
      </section>

      {bookingConfirm && (
        <div className={styles.toast}>
          ✅ {bookingConfirm.name} - Booked! Check your email for confirmation.
        </div>
      )}

      <section className={styles.whyChoose}>
        <h2>Why Book With Us?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>⚡</span>
            <h3>Lightning Fast</h3>
            <p>Book in seconds, confirm instantly</p>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>🎯</span>
            <h3>Same-Day Events</h3>
            <p>Events happening today, book right now</p>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>💰</span>
            <h3>Best Prices</h3>
            <p>Lowest rates, no hidden charges</p>
          </div>
          <div className={styles.benefit}>
            <span className={styles.benefitIcon}>✅</span>
            <h3>Instant Confirmation</h3>
            <p>Get your tickets immediately</p>
          </div>
        </div>
      </section>
    </div>
  );
}

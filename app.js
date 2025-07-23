class TinderApp {
    constructor() {
        // Профили захардкожены в JavaScript
        this.profiles = [
            {
                id: '1',
                name: 'Анна',
                age: 25,
                bio: 'Люблю путешествия, фотографию и хороший кофе ☕',
                mainPhoto: '/images/anna-main.svg',
                photos: [
                    '/images/anna-main.svg',
                    '/images/anna-2.svg',
                    '/images/anna-3.svg',
                    '/images/anna-4.svg'
                ],
                location: 'Москва',
                interests: ['путешествия', 'фотография', 'кофе', 'искусство']
            },
            {
                id: '2',
                name: 'Мария',
                age: 23,
                bio: 'Студентка, увлекаюсь танцами и йогой 🧘‍♀️',
                mainPhoto: '/images/maria-main.svg',
                photos: [
                    '/images/maria-main.svg',
                    '/images/maria-2.svg',
                    '/images/maria-3.svg'
                ],
                location: 'Санкт-Петербург',
                interests: ['танцы', 'йога', 'музыка', 'спорт']
            },
            {
                id: '3',
                name: 'Елена',
                age: 27,
                bio: 'Дизайнер, люблю искусство и активный образ жизни 🎨',
                mainPhoto: '/images/elena-main.svg',
                photos: [
                    '/images/elena-main.svg',
                    '/images/elena-2.svg',
                    '/images/elena-3.svg',
                    '/images/elena-4.svg',
                    '/images/elena-5.svg'
                ],
                location: 'Казань',
                interests: ['дизайн', 'искусство', 'спорт', 'путешествия']
            },
            {
                id: '4',
                name: 'Дарья',
                age: 24,
                bio: 'Маркетолог, обожаю готовить и читать книги 📚',
                mainPhoto: '/images/daria-main.svg',
                photos: [
                    '/images/daria-main.svg',
                    '/images/daria-2.svg',
                    '/images/daria-3.svg'
                ],
                location: 'Новосибирск',
                interests: ['маркетинг', 'кулинария', 'чтение', 'кино']
            },
            {
                id: '5',
                name: 'Кристина',
                age: 26,
                bio: 'Врач, люблю спорт и активный отдых 🏃‍♀️',
                mainPhoto: '/images/kristina-main.svg',
                photos: [
                    '/images/kristina-main.svg',
                    '/images/kristina-2.svg',
                    '/images/kristina-3.svg',
                    '/images/kristina-4.svg'
                ],
                location: 'Екатеринбург',
                interests: ['медицина', 'спорт', 'природа', 'путешествия']
            }
        ];
        
        this.currentProfileIndex = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.currentCard = null;
        this.matches = [];
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.renderCards();
    }

    setupEventListeners() {
        // Action buttons
        document.getElementById('dislikeBtn').addEventListener('click', () => this.swipe('left'));
        document.getElementById('likeBtn').addEventListener('click', () => this.swipe('right'));
        document.getElementById('superlikeBtn').addEventListener('click', () => this.swipe('superlike'));
        
        // Header buttons
        document.getElementById('refreshBtn').addEventListener('click', () => this.loadProfiles());
        document.getElementById('matchesBtn').addEventListener('click', () => this.showMatches());
        
        // Modal close buttons
        document.getElementById('closeModal').addEventListener('click', () => this.closePhotoModal());
        document.getElementById('closeMatchesModal').addEventListener('click', () => this.closeMatchesModal());
        
        // Photo gallery navigation
        document.getElementById('prevPhoto').addEventListener('click', () => this.prevPhoto());
        document.getElementById('nextPhoto').addEventListener('click', () => this.nextPhoto());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.swipe('left');
            if (e.key === 'ArrowRight') this.swipe('right');
            if (e.key === 'Escape') {
                this.closePhotoModal();
                this.closeMatchesModal();
            }
        });

        // Touch and mouse events for swiping
        this.setupSwipeEvents();
    }

    setupSwipeEvents() {
        const cardStack = document.getElementById('cardStack');
        
        // Mouse events
        cardStack.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        
        // Touch events
        cardStack.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrag(e.touches[0]);
        });
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.drag(e.touches[0]);
        });
        document.addEventListener('touchend', () => this.endDrag());
    }

    startDrag(e) {
        if (this.currentProfileIndex >= this.profiles.length) return;
        
        this.isDragging = true;
        this.startX = e.clientX || e.pageX;
        this.startY = e.clientY || e.pageY;
        this.currentX = this.startX;
        this.currentY = this.startY;
        
        // Исправление: берем первую карточку (с максимальным z-index)
        this.currentCard = document.querySelector('.card');
        if (this.currentCard) {
            this.currentCard.style.transition = 'none';
        }
    }

    drag(e) {
        if (!this.isDragging || !this.currentCard) return;
        
        this.currentX = e.clientX || e.pageX;
        this.currentY = e.clientY || e.pageY;
        
        const deltaX = this.currentX - this.startX;
        const deltaY = this.currentY - this.startY;
        const rotation = deltaX * 0.1;
        
        this.currentCard.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`;
        
        // Add visual feedback
        if (deltaX > 50) {
            this.currentCard.style.border = '3px solid #51cf66';
        } else if (deltaX < -50) {
            this.currentCard.style.border = '3px solid #ff6b6b';
        } else {
            this.currentCard.style.border = 'none';
        }
    }

    endDrag() {
        if (!this.isDragging || !this.currentCard) return;
        
        this.isDragging = false;
        this.currentCard.style.transition = 'transform 0.3s ease';
        
        const deltaX = this.currentX - this.startX;
        const threshold = 100;
        
        if (Math.abs(deltaX) > threshold) {
            const direction = deltaX > 0 ? 'right' : 'left';
            this.swipe(direction);
        } else {
            // Return card to original position
            this.currentCard.style.transform = 'translate(0, 0) rotate(0deg)';
            this.currentCard.style.border = 'none';
        }
        
        this.currentCard = null;
    }

    loadProfiles() {
        // Просто сбрасываем индекс и перерисовываем карточки
        this.currentProfileIndex = 0;
        this.matches = [];
        this.renderCards();
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const cardStack = document.getElementById('cardStack');
        const noProfiles = document.getElementById('noProfiles');
        
        if (show) {
            loading.style.display = 'block';
            cardStack.style.display = 'none';
            noProfiles.style.display = 'none';
        } else {
            loading.style.display = 'none';
            cardStack.style.display = 'block';
        }
    }

    showNoProfiles() {
        const noProfiles = document.getElementById('noProfiles');
        const cardStack = document.getElementById('cardStack');
        noProfiles.style.display = 'block';
        cardStack.style.display = 'none';
    }

    renderCards() {
        const cardStack = document.getElementById('cardStack');
        cardStack.innerHTML = '';
        
        // Show next 3 cards
        for (let i = 0; i < 3 && this.currentProfileIndex + i < this.profiles.length; i++) {
            const profile = this.profiles[this.currentProfileIndex + i];
            const card = this.createCard(profile, i);
            cardStack.appendChild(card);
        }
    }

    createCard(profile, index) {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.zIndex = 3 - index;
        card.style.transform = `scale(${1 - index * 0.05}) translateY(${index * 10}px)`;
        
        card.innerHTML = `
            <div class="card-image" style="background-image: url('${profile.mainPhoto}')" onclick="app.openPhotoModal('${profile.id}')"></div>
            <div class="card-overlay">
                <div class="card-name">${profile.name}, ${profile.age}</div>
                <div class="card-bio">${profile.bio}</div>
                <div class="card-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${profile.location}
                </div>
                <div class="card-interests">
                    ${profile.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
                </div>
            </div>
        `;
        
        return card;
    }

    swipe(direction) {
        if (this.currentProfileIndex >= this.profiles.length) return;
        
        // Исправление: берем первую карточку (с максимальным z-index)
        const currentCard = document.querySelector('.card');
        if (!currentCard) return;
        
        const profile = this.profiles[this.currentProfileIndex];
        
        // Animate card
        currentCard.style.transition = 'transform 0.3s ease';
        if (direction === 'right') {
            currentCard.classList.add('liked');
            
            // Создаем матч (30% шанс)
            if (Math.random() > 0.7) {
                const match = {
                    id: Date.now().toString(),
                    profileId: profile.id,
                    timestamp: new Date().toISOString()
                };
                this.matches.push(match);
                
                // Show match modal
                setTimeout(() => this.showMatchModal(), 300);
            }
        } else if (direction === 'left') {
            currentCard.classList.add('disliked');
        }
        
        // Move to next profile
        setTimeout(() => {
            this.currentProfileIndex++;
            this.renderCards();
        }, 300);
    }

    showMatchModal() {
        const modal = document.getElementById('matchModal');
        modal.style.display = 'block';
    }

    closeMatchModal() {
        const modal = document.getElementById('matchModal');
        modal.style.display = 'none';
    }

    openPhotoModal(profileId) {
        const profile = this.profiles.find(p => p.id === profileId);
        if (!profile) return;
        
        this.currentPhotoIndex = 0;
        this.currentProfile = profile;
        
        const modal = document.getElementById('photoModal');
        const modalPhoto = document.getElementById('modalPhoto');
        const modalProfileName = document.getElementById('modalProfileName');
        
        modalProfileName.textContent = `${profile.name}, ${profile.age}`;
        modalPhoto.src = profile.photos[0];
        
        this.updatePhotoIndicators();
        modal.style.display = 'block';
    }

    closePhotoModal() {
        const modal = document.getElementById('photoModal');
        modal.style.display = 'none';
    }

    prevPhoto() {
        if (!this.currentProfile) return;
        
        this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.currentProfile.photos.length) % this.currentProfile.photos.length;
        this.updatePhoto();
    }

    nextPhoto() {
        if (!this.currentProfile) return;
        
        this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.currentProfile.photos.length;
        this.updatePhoto();
    }

    updatePhoto() {
        const modalPhoto = document.getElementById('modalPhoto');
        modalPhoto.src = this.currentProfile.photos[this.currentPhotoIndex];
        this.updatePhotoIndicators();
    }

    updatePhotoIndicators() {
        const indicators = document.getElementById('photoIndicators');
        indicators.innerHTML = '';
        
        this.currentProfile.photos.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${index === this.currentPhotoIndex ? 'active' : ''}`;
            indicator.onclick = () => {
                this.currentPhotoIndex = index;
                this.updatePhoto();
            };
            indicators.appendChild(indicator);
        });
    }

    showMatches() {
        const matchesList = document.getElementById('matchesList');
        matchesList.innerHTML = '';
        
        if (this.matches.length === 0) {
            matchesList.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">У вас пока нет матчей</p>';
        } else {
            this.matches.forEach(match => {
                const profile = this.profiles.find(p => p.id === match.profileId);
                if (profile) {
                    const matchItem = document.createElement('div');
                    matchItem.className = 'match-item';
                    matchItem.innerHTML = `
                        <img src="${profile.mainPhoto}" alt="${profile.name}">
                        <div class="match-item-info">
                            <h4>${profile.name}, ${profile.age}</h4>
                            <p>${profile.location}</p>
                        </div>
                    `;
                    matchItem.onclick = () => this.openPhotoModal(profile.id);
                    matchesList.appendChild(matchItem);
                }
            });
        }
        
        const modal = document.getElementById('matchesModal');
        modal.style.display = 'block';
    }

    closeMatchesModal() {
        const modal = document.getElementById('matchesModal');
        modal.style.display = 'none';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TinderApp();
});

// Global functions for HTML onclick handlers
function loadProfiles() {
    if (window.app) {
        window.app.loadProfiles();
    }
}

function closeMatchModal() {
    if (window.app) {
        window.app.closeMatchModal();
    }
} 
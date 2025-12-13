// Email collection for launch notifications
function setupEmailCollection() {
    const form = document.getElementById('notify-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const button = document.getElementById('submit-btn');
        const message = document.getElementById('message');
        
        // Simple validation
        if (!email || !email.includes('@')) {
            message.textContent = 'Please enter a valid email';
            message.style.color = '#ff0000';
            return;
        }
        
        // Store in localStorage (for now)
        let emails = JSON.parse(localStorage.getItem('earlyAccessEmails') || '[]');
        
        if (emails.includes(email)) {
            message.textContent = 'You\'re already on the list! 🎉';
            message.style.color = '#667eea';
        } else {
            emails.push(email);
            localStorage.setItem('earlyAccessEmails', JSON.stringify(emails));
            
            message.textContent = '✅ Success! We\'ll notify you at launch.';
            message.style.color = '#10b981';
            
            // Clear form
            form.reset();
            
            // Log for developer
            console.log('Early access signup:', email);
            console.log('Total signups:', emails.length);
        }
        
        setTimeout(() => {
            message.textContent = '';
        }, 5000);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', setupEmailCollection);

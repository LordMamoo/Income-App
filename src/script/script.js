class ProfileManager { //manages profiles
    constructor() {
        this.profiles = JSON.parse(localStorage.getItem('profiles')) || [];
        this.activeProfile = JSON.parse(localStorage.getItem('activeProfile')) || null;
    }

    setActiveProfile(email) { // Switch active profile
        const profile = this.profiles.find(p => p.email === email);
        if (profile) {
            this.activeProfile = profile;
            localStorage.setItem('activeProfile', JSON.stringify(profile)); // Store the entire profile
            localStorage.setItem('activeProfileEmail', profile.email); // Store just the email as a quick reference
        } else {
            console.error('Profile not found');
        }
    }

    addProfile(profile) { // Create new profile
        if (this.profiles.some(p => p.email === profile.email)) {
            console.error('Profile with this email already exists');
            return;
        }
        this.profiles.push(profile);
        localStorage.setItem('profiles', JSON.stringify(this.profiles));
        this.setActiveProfile(profile.email);
    }

    getActiveProfile() {
        return this.activeProfile;
    }

    getProfiles() {
        return this.profiles
    }

    signOut() { // Log out of the active profile
        this.activeProfile = null;
        localStorage.removeItem('activeProfile');
        localStorage.removeItem('activeProfileEmail');
    }
}

class Profile { //creates a new profile
    constructor (name, email, age) {
        this.name = name;
        this.email = email;
        this.age = age;
        this.income = 0;
        this.expenses = 0;
    }
    
    getProfileInfo() {
        return `${this.name}, ${this.age} years old, Email: ${this.email}`
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const profileSelect = document.getElementById("profileSelect");
    const loginBtn = document.getElementById("loginBtn");
    const createProfileBtn = document.getElementById("createProfileBtn");

    let profiles = JSON.parse(localStorage.getItem("profiles")) || [];

    // Populate profile dropdown
    function loadProfiles() {
        profileSelect.innerHTML = '<option value="">-- Choose Profile --</option>';
        profiles.forEach(profile => {
            const option = document.createElement("option");
            option.value = profile.email;
            option.textContent = profile.name;
            profileSelect.appendChild(option);
        });
    }

    loadProfiles();

    // Log in an existing profile
    loginBtn.addEventListener("click", () => {
        const selectedEmail = profileSelect.value;

        if (selectedEmail) {
            localStorage.setItem("activeProfileEmail", selectedEmail);
            window.location.href = "home.html"; // Redirect to main app
        } else {
            alert("Please select a profile to log in.");
        }
    });

    // Create a new profile
    createProfileBtn.addEventListener("click", () => {
        const name = document.getElementById("newName").value.trim();
        const email = document.getElementById("newEmail").value.trim();
        const age = document.getElementById("newAge").value.trim();

        if (!name || !email || isNaN(age) || age <= 0) {
            alert("Please enter a valid name, email, and positive age.");
            return;
        }

        if (profiles.some(profile => profile.email === email)) {
            alert("A profile with this email already exists.");
            return;
        }

        // Create new profile
        const newProfile = new Profile(name, email, age);
        profiles.push(newProfile);
        localStorage.setItem("profiles", JSON.stringify(profiles));

        const profileManager = new ProfileManager();
        profileManager.setActiveProfile(email);

        loadProfiles(); // Update dropdown
        profileSelect.value = email;

        alert("Profile created successfully! Please log in.");
    });
});

document.getElementById("prof-name").innerHTML = `${activeProfile.name}`;
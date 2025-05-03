// /**
//  * Checks if an email belongs to a valid university domain.
//  * @param {string} email - The email address to validate.
//  * @param {string[]} validDomains - Array of valid university email domains (e.g., "ac.lk").
//  * @returns {boolean} - Returns true if the email belongs to a valid domain, otherwise false.
//  */
function isUniversityEmail(email, validDomains) {
    if (typeof email !== "string" || !Array.isArray(validDomains)) {
        throw new Error("Invalid arguments: email must be a string and validDomains must be an array.");
    }

    const emailDomain = email.split("@")[1]; // Extract the domain part of the email
    if (!emailDomain) return false;

    // Check if the domain ends with any valid university domain
    return validDomains.some((domain) => emailDomain.endsWith(domain));
}

// Example Usage
// const validDomains = ["ac.lk", "edu.au", "university.com"];
// console.log(isUniversityEmail("student@university.ac.lk", validDomains)); // true
// console.log(isUniversityEmail("john.doe@gmail.com", validDomains));        // false
// console.log(isUniversityEmail("professor@college.edu.au", validDomains)); // true

module.exports = isUniversityEmail
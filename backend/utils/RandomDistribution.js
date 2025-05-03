/**
 * Randomly distributes items into groups
 * @param {number} groups - Number of groups (n)
 * @param {number} items - Number of items to distribute (m)
 * @returns {number[]} Array of item counts per group
 */

function distributeItems(groups, items) {
    // Initialize array with zeros for each group
    const distribution = new Array(groups).fill(0);
    
    // Edge cases
    if (groups <= 0) return [];
    if (items <= 0) return distribution;
    
    // Distribute items one by one to random groups
    for (let i = 0; i < items; i++) {
      const randomGroup = Math.floor(Math.random() * groups);
      distribution[randomGroup]++;
    }
    
    return distribution;
}
  
// Alternative version that ensures no empty groups (if m >= n)
function distributeItemsNonEmpty(groups, items) {
    if (groups <= 0) return [];
    if (items < groups) {
      throw new Error("Cannot guarantee non-empty groups when items < groups");
    }
    
    const distribution = new Array(groups).fill(1);
    const remainingItems = items - groups;
    
    // Distribute remaining items randomly
    for (let i = 0; i < remainingItems; i++) {
      const randomGroup = Math.floor(Math.random() * groups);
      distribution[randomGroup]++;
    }
    
    return distribution;
}

// Binomial distribution approach (more mathematically sound)
// Each group gets approximately m/n items on average
// Variance decreases as m increases

function binomialDistribution(groups, items) {
    const distribution = [];
    let remainingItems = items;
    
    for (let i = 0; i < groups - 1; i++) {
      // Probability for each item to go to this group
      const p = 1 / (groups - i);
      const count = Array(remainingItems)
        .fill()
        .reduce(a => a + (Math.random() < p ? 1 : 0), 0);
      
      distribution.push(count);
      remainingItems -= count;
    }
    distribution.push(remainingItems);
    
    return distribution;
  }

module.exports = {
    distributeItems,
    distributeItemsNonEmpty
}
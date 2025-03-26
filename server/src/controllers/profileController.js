const {findUserById,updateUserById } = require('../models/userModel');


const getUserProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // Exclude password from the response
    const { password, ...userDetails } = user;
    res.json({ success: true, user: userDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile'+error });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await updateUserById(req.user.id, req.body);
    if (!updatedUser) return res.status(404).json({ success: false, error: 'User not found' });

    // Exclude password from response
    const { password, ...userDetails } = updatedUser;
    res.json({ success: true, message: "Profile updated successfully", user: userDetails });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

module.exports = {updateUserProfile,getUserProfile };

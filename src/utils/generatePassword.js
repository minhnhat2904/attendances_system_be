export const generatePassword = async () => {
	try {
		return Math.random().toString(36).slice(-8);
	} catch (error) {
		return null;
	}
};
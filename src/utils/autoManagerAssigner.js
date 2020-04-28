const assignManager = (managersList) => {
    return managersList[Math.floor(Math.random() * managersList.length)];
}
export default assignManager;

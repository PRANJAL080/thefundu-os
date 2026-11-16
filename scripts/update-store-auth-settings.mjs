import fs from 'fs';

const storePath = 'src/lib/store.tsx';
let content = fs.readFileSync(storePath, 'utf8');

// 1. Check if login already exists
if (!content.includes('const login =')) {
  // Add state definitions right after userRole
  const stateInsertTarget = '  const isCashierMode = userRole === "cashier";';
  const stateInsertReplacement = `  const isCashierMode = userRole === "cashier";

  // Authentication & Session State (ID/Password Protected)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Active Store Outlet Selection
  const [selectedStoreId, setSelectedStoreId] = useState<string>("STR-LKO-01");

  // Dynamic Company & Invoice Settings
  const initialInvoiceSettings: InvoiceSettings = {
    companyLegalName: COMPANY_CONFIG.legalName,
    registeredAddress: COMPANY_CONFIG.registeredAddress,
    cin: COMPANY_CONFIG.cin,
    gstin: COMPANY_CONFIG.gstin,
    pan: COMPANY_CONFIG.pan,
    stateName: COMPANY_CONFIG.stateName,
    stateCode: COMPANY_CONFIG.stateCode,
    tollFree: COMPANY_CONFIG.tollFree,
    supportEmail: COMPANY_CONFIG.supportEmail,
    whatsappPhone: COMPANY_CONFIG.phone,
    defaultWarrantyDays: 180,
    termsAndConditions: DEFAULT_INVOICE_TERMS,
  };
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettings>(initialInvoiceSettings);

  // Super Admin Configurable Role Permissions
  const [rolePermissions, setRolePermissions] = useState<Record<string, string[]>>(DEFAULT_ROLE_PERMISSIONS);`;

  content = content.replace(stateInsertTarget, stateInsertReplacement);

  // 2. Add keys to STORAGE_KEYS
  const storageKeysTarget = 'userRole: "thefundu_user_role_v5",';
  const storageKeysReplacement = `userRole: "thefundu_user_role_v5",
    authUser: "thefundu_auth_user_v6",
    selectedStoreId: "thefundu_selected_store_id_v6",
    invoiceSettings: "thefundu_invoice_settings_v6",
    rolePermissions: "thefundu_role_perms_v6",`;

  content = content.replace(storageKeysTarget, storageKeysReplacement);

  // 3. Add hydration inside useEffect
  const hydrationTarget = `      const storedRole = localStorage.getItem(STORAGE_KEYS.userRole);
      if (storedRole && ["admin", "manager", "cashier", "technician"].includes(storedRole)) {
        setUserRole(storedRole as UserRole);
      }`;

  const hydrationReplacement = `      const storedRole = localStorage.getItem(STORAGE_KEYS.userRole);
      if (storedRole && ["admin", "manager", "cashier", "technician"].includes(storedRole)) {
        setUserRole(storedRole as UserRole);
      }
      const storedAuth = localStorage.getItem(STORAGE_KEYS.authUser);
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth);
          if (parsed && parsed.id) {
            setCurrentUser(parsed);
            setUserRole(parsed.role || "admin");
          }
        } catch (e) {}
      }
      const storedStoreId = localStorage.getItem(STORAGE_KEYS.selectedStoreId);
      if (storedStoreId) setSelectedStoreId(storedStoreId);

      const storedInvoiceSettings = localStorage.getItem(STORAGE_KEYS.invoiceSettings);
      if (storedInvoiceSettings) {
        try {
          const parsed = JSON.parse(storedInvoiceSettings);
          if (parsed && parsed.companyLegalName) setInvoiceSettings(parsed);
        } catch (e) {}
      }

      const storedRolePerms = localStorage.getItem(STORAGE_KEYS.rolePermissions);
      if (storedRolePerms) {
        try {
          const parsed = JSON.parse(storedRolePerms);
          if (parsed && parsed.admin) setRolePermissions(parsed);
        } catch (e) {}
      }`;

  content = content.replace(hydrationTarget, hydrationReplacement);

  // 4. Add methods: login, logout, updateStore, updateInvoiceSettings, updateRolePermissions
  const methodsInsertTarget = '  // Spare Parts Implementation';
  const methodsInsertReplacement = `  // Authentication & Access Control Handlers
  const login = (emailOrId: string, pass: string): boolean => {
    const clean = emailOrId.trim().toLowerCase();
    const matched = INITIAL_USERS.find(
      (u) =>
        (u.email.toLowerCase() === clean || u.id.toLowerCase() === clean) &&
        u.password === pass
    );

    if (matched) {
      const profile: UserProfile = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        storeCode: matched.storeCode,
        storeName: matched.storeName,
        phone: matched.phone,
        pin: matched.pin,
      };
      setCurrentUser(profile);
      setUserRole(profile.role);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(profile));
          localStorage.setItem(STORAGE_KEYS.userRole, profile.role);
        } catch (e) {}
      }
      showToast(\`Welcome \${profile.name}! Logged in as \${profile.role.toUpperCase()}.\`, "success");
      return true;
    }

    showToast("Invalid Credentials. Please check your Email / Employee ID and Password.", "error");
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_KEYS.authUser);
      } catch (e) {}
    }
    showToast("Signed out successfully.", "info");
  };

  const updateStore = (id: string, updates: Partial<Warehouse>) => {
    const updated = warehouses.map((w) => (w.id === id || w.code === id ? { ...w, ...updates } : w));
    setWarehouses(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.warehouses, JSON.stringify(updated));
      } catch (e) {}
    }
    showToast("Store details updated!", "success");
  };

  const updateInvoiceSettings = (updates: Partial<InvoiceSettings>) => {
    setInvoiceSettings((prev) => {
      const next = { ...prev, ...updates };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEYS.invoiceSettings, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
    showToast("Invoice & company settings updated!", "success");
  };

  const updateRolePermissions = (role: UserRole, permissions: string[]) => {
    setRolePermissions((prev) => {
      const next = { ...prev, [role]: permissions };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEYS.rolePermissions, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
    showToast(\`Permissions updated for \${role.toUpperCase()}!\`, "success");
  };

  // Spare Parts Implementation`;

  content = content.replace(methodsInsertTarget, methodsInsertReplacement);

  // 5. Add to AppContext.Provider value
  const contextValueTarget = '        userRole,\n        setUserRole,\n        isCashierMode,';
  const contextValueReplacement = `        currentUser,
        login,
        logout,
        rolePermissions,
        updateRolePermissions,

        // RBAC
        userRole,
        setUserRole,
        isCashierMode,

        // Multi-Store
        selectedStoreId,
        setSelectedStoreId,
        updateStore,

        // Invoice Settings
        invoiceSettings,
        updateInvoiceSettings,`;

  content = content.replace(contextValueTarget, contextValueReplacement);

  fs.writeFileSync(storePath, content, 'utf8');
  console.log("Successfully updated src/lib/store.tsx with auth, multi-store, and invoice settings!");
} else {
  console.log("Already updated src/lib/store.tsx");
}

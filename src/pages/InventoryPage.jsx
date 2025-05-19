// InventoryPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PageHero from "../components/PageHero";
import InventoryFilterPanel from "../components/InventoryFilterPanel";
import InventoryResults from "../components/InventoryResults";
import vehicleService from "../services/vehicleService";
import Sidebar from "../components/Sidebar";
import { IoIosArrowForward } from "react-icons/io";

const InventoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState({ field: "price", direction: "asc" });
  const [pagination, setPagination] = useState({ pageSize: 10, pageNumber: 1 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    // Sync state from URL params
    const params = Object.fromEntries(searchParams.entries());
    const urlFilters = {};
    Object.keys(params).forEach((key) => {
      if (["page", "sortField", "sortDir"].includes(key)) return;
      urlFilters[key] = params[key];
    });
    setFilters(urlFilters);
    if (params.sortField && params.sortDir) {
      setSorting({ field: params.sortField, direction: params.sortDir });
    }
    if (params.page) {
      setPagination((prev) => ({ ...prev, pageNumber: Number(params.page) }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        console.log("Fetching vehicles with filters:", {
          filters,
          sorting,
          pagesize: pagination.pageSize,
          pageNumber: pagination.pageNumber,
        });

        const { vehicles: fetchedVehicles, totalCount: count } =
          await vehicleService.getVehicles(
            filters,
            sorting,
            pagination.pageSize,
            pagination.pageNumber
          );

        setVehicles(fetchedVehicles);
        setTotalCount(count);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [filters, sorting, pagination.pageSize, pagination.pageNumber]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    console.log("URL params updated:", params.toString());
    params.set("page", "1");
    params.set("sortField", sorting.field);
    params.set("sortDir", sorting.direction);
    setSearchParams(params);
  };

  const handleSortChange = (field, direction) => {
    setSorting({ field, direction });
    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field);
    params.set("sortDir", direction);
    setSearchParams(params);
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({ ...prev, pageNumber }));
    // Update URL
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    setSearchParams(params);
  };

  const handleFilterButtonClick = (section) => {
    setSidebarOpen(true);
    setTimeout(() => {
      filterPanelRef.current?.scrollToSection(section);
    }, 100); // give time for panel to render
  };

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Our Vehicle Inventory"
          subtitle="Explore our selection of premium vehicles"
          className="inventory-hero"
        />

        {/* <InventoryFilterPanel onFilterChange={handleFilterChange} /> */}

        {/* Buttons to open filter categories */}
        <div className="filter-buttons">
          {[
            "Vehicle Type",
            "Make",
            "Model",
            "Year",
            "Price Range",
            "Mileage",
            "Fuel Type",
            "Transmission",
            "Drive Train",
            "Color",
            "Other",
          ].map((label, index) => (
            <button
              key={index}
              className="btn-filter-option"
              onClick={openSidebar}
            >
              {label}{" "}
              <IoIosArrowForward
                style={{ color: "gray", fontSize: "0.9rem" }}
              />
            </button>
          ))}
        </div>

        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
          <InventoryFilterPanel
            onFilterChange={(filters) => {
              handleFilterChange(filters);
              closeSidebar(); // Auto-close after applying filters
            }}
          />
        </Sidebar>

        {loading ? (
          <div className="loading">Loading vehicles...</div>
        ) : (
          <InventoryResults
            vehicles={vehicles}
            totalCount={totalCount}
            sorting={sorting}
            onSortChange={handleSortChange}
            onPageChange={handlePageChange}
            currentPage={pagination.pageNumber}
            pageSize={pagination.pageSize}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default InventoryPage;

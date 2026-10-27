import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import "../styles/corporate.css";

/**
 * Corporate homepage for D&J Stratagem, Inc. (design concept 08 · Corporate).
 * Renders its own utility bar, header and footer, so App mounts it outside
 * MarketingLayout. Dashboard figures and supplier names are illustrative.
 */
export default function CorporateHome() {
  return (
    <>
      <Seo
        title="The construction business, run from one place."
        description="Find projects that match your trade, bid with confidence, source materials, staff the crew, and reserve the trucks. Stratagem connects every part of the job."
      />
      <div id="top" className="co" style={{ background: "#FFFFFF", color: "#111926", fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}>
        <div style={{ position: "relative", zIndex: "2", background: "linear-gradient(180deg, rgba(255,255,255,0.78), rgba(138,148,163,0.16))", backdropFilter: "blur(12px) saturate(160%)", borderBottom: "1px solid rgba(138,148,163,0.24)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)", color: "#474B53", fontSize: "13px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "9px clamp(20px, 4vw, 40px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "6px 24px" }}>
            <span>
              D&J Stratagem, Inc. · Los Angeles, California
            </span>
            <span style={{ display: "flex", flexWrap: "wrap", gap: "4px 22px" }}>
              <Link to="/help" className="lk">
                Help center
              </Link>
              <a className="lk" href="mailto:support@djstratageminc.com">
                support@djstratageminc.com
              </a>
            </span>
          </div>
        </div>
        <header style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E2D6" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "14px clamp(20px, 4vw, 40px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px 32px" }}>
            <a href="#top" aria-label="Stratagem home" style={{ display: "flex", alignItems: "center", gap: "10px", color: "#111926" }}>
              <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
                <rect width="30" height="30" rx="7" fill="#111926" />
                <path d="M8 20.5L15 8.5L22 20.5" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinejoin="round" />
                <path d="M10.5 23H19.5" stroke="#B8893B" strokeWidth="2.2" />
              </svg>
              <span style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif", fontSize: "19px", fontWeight: "700", letterSpacing: "-0.02em" }}>
                Stratagem
              </span>
            </a>
            <nav aria-label="Main" style={{ display: "flex", flexWrap: "wrap", gap: "2px 26px", fontSize: "14.5px", fontWeight: "500" }}>
              <a className="lk" href="#platform" style={{ padding: "10px 0" }}>
                Platform
              </a>
              <a className="lk" href="#companies" style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "10px 0" }}>
                Companies
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </a>
              <a className="lk" href="#how" style={{ padding: "10px 0" }}>
                How it works
              </a>
              <a className="lk" href="#company" style={{ padding: "10px 0" }}>
                About
              </a>
              <Link to="/pricing" className="lk" style={{ padding: "10px 0" }}>
                Pricing
              </Link>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link to="/login" className="lk" style={{ display: "inline-flex", alignItems: "center", minHeight: "44px", padding: "0 12px", fontSize: "14.5px", fontWeight: "500" }}>
                Sign in
              </Link>
              <Link to="/register" className="btn btn-ink" style={{ display: "inline-flex", alignItems: "center", minHeight: "40px", padding: "0 16px", background: "#111926", color: "#FFFFFF", borderRadius: "6px", fontSize: "14.5px", fontWeight: "600" }}>
                Get started
              </Link>
            </div>
          </div>
        </header>
        <section id="main" tabIndex="-1" aria-labelledby="co-h1" style={{ background: "radial-gradient(1000px 560px at 76% -120px, rgba(234,216,186,0.8), rgba(255,255,255,0) 70%), linear-gradient(180deg, #F8F9FB 0%, #FFFFFF 38%)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "88px clamp(20px, 4vw, 40px) 96px" }}>
            <div style={{ maxWidth: "880px" }}>
              <Link to="/fleet" className="more" style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "5px 12px 5px 5px", border: "1px solid #E8E2D6", borderRadius: "999px", fontSize: "13.5px", fontWeight: "500", color: "#111926" }}>
                <span style={{ padding: "2px 8px", borderRadius: "999px", background: "#F1E7D6", color: "rgb(127,95,41)", fontSize: "12px", fontWeight: "700" }}>
                  New
                </span>
                Stratagem Fleet is taking reservation requests
                <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                </svg>
              </Link>
              <h1 id="co-h1" style={{ margin: "28px 0 0", fontFamily: "'Inter Tight', 'Inter', sans-serif", fontSize: "clamp(42px, 5.8vw, 80px)", lineHeight: "1.02", fontWeight: "700", letterSpacing: "-0.035em" }}>
                The construction business,
                <br />
                <span style={{ color: "#B8893B" }}>
                  run from one place.
                </span>
              </h1>
              <p style={{ margin: "26px 0 0", maxWidth: "60ch", fontSize: "clamp(17px, 1.4vw, 19px)", lineHeight: "1.6", color: "#474B53" }}>
                Find projects that match your trade, bid with confidence, source materials, staff the crew, and reserve the trucks. Stratagem connects every part of the job.
              </p>
              <div style={{ marginTop: "32px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <Link to="/register" className="btn btn-ink" style={{ display: "inline-flex", alignItems: "center", minHeight: "48px", padding: "0 22px", background: "#111926", color: "#FFFFFF", borderRadius: "6px", fontSize: "15.5px", fontWeight: "600" }}>
                  Create your account
                </Link>
                <Link to="/contact" className="btn btn-line" style={{ display: "inline-flex", alignItems: "center", minHeight: "48px", padding: "0 20px", border: "1px solid #DCD5C8", borderRadius: "6px", color: "#111926", fontSize: "15.5px", fontWeight: "600" }}>
                  Talk to our team
                </Link>
              </div>
              <ul style={{ listStyle: "none", margin: "26px 0 0", padding: "0", display: "flex", flexWrap: "wrap", gap: "10px 28px", fontSize: "14px", color: "#474B53" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4.5" fill="none" stroke="#B8893B" strokeWidth="2" />
                  </svg>
                  Free to start
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4.5" fill="none" stroke="#B8893B" strokeWidth="2" />
                  </svg>
                  Every account reviewed by a person
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4.5" fill="none" stroke="#B8893B" strokeWidth="2" />
                  </svg>
                  Based in Los Angeles
                </li>
              </ul>
            </div>
            <div style={{ marginTop: "64px", border: "1px solid #E8E2D6", borderRadius: "12px", overflow: "hidden", background: "#FFFFFF", boxShadow: "0 1px 2px rgba(17,25,38,0.04), 0 28px 64px rgba(17,25,38,0.09)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "10px 16px", borderBottom: "1px solid #E8E2D6", background: "#FBF9F5" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 12px", border: "1px solid #E8E2D6", borderRadius: "6px", background: "#FFFFFF", fontSize: "12.5px", color: "#5E626B" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M3 5.5V4a3 3 0 0 1 6 0v1.5M2.5 5.5h7v5h-7z" fill="none" stroke="#5E626B" strokeWidth="1.2" />
                  </svg>
                  djstratageminc.com/dashboard
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                <aside className="hide-sm" aria-label="Dashboard menu" style={{ flex: "0 0 220px", background: "#FAF7F2", borderRight: "1px solid #E8E2D6" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px", borderBottom: "1px solid #E8E2D6" }}>
                    <span aria-hidden="true" style={{ width: "32px", height: "32px", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", background: "#111926", color: "#FFFFFF", fontSize: "12px", fontWeight: "700" }}>
                      RB
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                      <span style={{ fontSize: "13.5px", fontWeight: "600" }}>
                        Ridgeline Builders
                      </span>
                      <span style={{ fontSize: "12px", color: "#5E626B" }}>
                        General contractor
                      </span>
                    </span>
                  </div>
                  <ul style={{ listStyle: "none", margin: "0", padding: "10px", display: "flex", flexDirection: "column", gap: "2px", fontSize: "13.5px", color: "#474B53" }}>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", border: "1px solid #E8E2D6", borderRadius: "6px", background: "#FFFFFF", color: "#111926", fontWeight: "600" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M2.5 2.5h4.5v4.5H2.5zM9 2.5h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z" fill="none" stroke="#B8893B" strokeWidth="1.5" />
                      </svg>
                      Overview
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", border: "1px solid transparent" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M8 14.5S3.5 10.4 3.5 6.9a4.5 4.5 0 0 1 9 0c0 3.5-4.5 7.6-4.5 7.6zM8 8.4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                      Projects
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", border: "1px solid transparent" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M4 1.5h5l3 3v10H4zM9 1.5v3h3M6 8h4M6 10.5h4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                      Bids
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", border: "1px solid transparent" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M2.5 5L8 2l5.5 3v6L8 14l-5.5-3zM2.5 5L8 8l5.5-3M8 8v6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                      </svg>
                      Materials
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", border: "1px solid transparent" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M6 7.4a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6zM1.8 13.5c.4-2.4 2.2-3.8 4.2-3.8s3.8 1.4 4.2 3.8M11 3a2.2 2.2 0 0 1 0 4.2M12.2 9.8c1.2.5 2 1.7 2.2 3.7" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                      Crews
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", border: "1px solid transparent" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M1.5 4h8v6.5h-8zM9.5 6.5h3l2 2.2v1.8h-5z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                        <circle cx="4.2" cy="12" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                        <circle cx="11.8" cy="12" r="1.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                      Fleet
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", border: "1px solid transparent" }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <circle cx="8" cy="8" r="2.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                      Settings
                    </li>
                  </ul>
                </aside>
                <div style={{ flex: "1 1 560px", minWidth: "0", padding: "22px 24px 24px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "12px 24px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span style={{ fontSize: "18px", fontWeight: "700", letterSpacing: "-0.01em" }}>
                        Good morning, Dana
                      </span>
                      <span style={{ fontSize: "13.5px", color: "#5E626B" }}>
                        Here's where your pursuits stand today.
                      </span>
                    </div>
                    <button type="button" style={{ display: "inline-flex", alignItems: "center", gap: "8px", minHeight: "36px", padding: "0 14px", border: "0", borderRadius: "6px", background: "#111926", color: "#FFFFFF", font: "inherit", fontSize: "13.5px", fontWeight: "600", cursor: "pointer" }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                        <path d="M6 1.5V10.5M1.5 6H10.5" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
                      </svg>
                      New bid
                    </button>
                  </div>
                  <div style={{ marginTop: "18px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 100%), 1fr))", gap: "12px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "14px", border: "1px solid #E8E2D6", borderRadius: "8px" }}>
                      <span style={{ fontSize: "12.5px", color: "#5E626B" }}>
                        Open bids
                      </span>
                      <span className="num" style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-0.02em", lineHeight: "1" }}>
                        12
                      </span>
                      <span style={{ fontSize: "12.5px", fontWeight: "600", color: "rgb(127,95,41)" }}>
                        3 due this week
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "14px", border: "1px solid #E8E2D6", borderRadius: "8px" }}>
                      <span style={{ fontSize: "12.5px", color: "#5E626B" }}>
                        Matched projects
                      </span>
                      <span className="num" style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-0.02em", lineHeight: "1" }}>
                        48
                      </span>
                      <span style={{ fontSize: "12.5px", fontWeight: "600", color: "rgb(127,95,41)" }}>
                        +6 since Monday
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "14px", border: "1px solid #E8E2D6", borderRadius: "8px" }}>
                      <span style={{ fontSize: "12.5px", color: "#5E626B" }}>
                        Material quotes
                      </span>
                      <span className="num" style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-0.02em", lineHeight: "1" }}>
                        9
                      </span>
                      <span style={{ fontSize: "12.5px", fontWeight: "600", color: "rgb(127,95,41)" }}>
                        2 awaiting reply
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "14px", border: "1px solid #E8E2D6", borderRadius: "8px" }}>
                      <span style={{ fontSize: "12.5px", color: "#5E626B" }}>
                        Vehicle reservations
                      </span>
                      <span className="num" style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-0.02em", lineHeight: "1" }}>
                        4
                      </span>
                      <span style={{ fontSize: "12.5px", fontWeight: "600", color: "rgb(127,95,41)" }}>
                        Next: Thu, 7:00 am
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "16px" }}>
                    <div style={{ flex: "1.7 1 420px", minWidth: "0", border: "1px solid #E8E2D6", borderRadius: "8px", overflow: "hidden" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 14px", borderBottom: "1px solid #E8E2D6" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600" }}>
                          Active pursuits
                        </span>
                        <span style={{ fontSize: "12.5px", color: "#5E626B" }}>
                          4 of 12
                        </span>
                      </div>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", minWidth: "460px", borderCollapse: "collapse", fontSize: "13px" }}>
                          <thead>
                            <tr style={{ textAlign: "left", color: "#5E626B", background: "#FBF9F5" }}>
                              <th scope="col" style={{ padding: "9px 14px", fontWeight: "500" }}>
                                Project
                              </th>
                              <th scope="col" style={{ padding: "9px 10px", fontWeight: "500" }}>
                                Trade
                              </th>
                              <th scope="col" style={{ padding: "9px 10px", fontWeight: "500" }}>
                                City
                              </th>
                              <th scope="col" style={{ padding: "9px 10px", fontWeight: "500" }}>
                                Due
                              </th>
                              <th scope="col" style={{ padding: "9px 14px", fontWeight: "500" }}>
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{ borderTop: "1px solid #F0EBE2" }}>
                              <td style={{ padding: "11px 14px", fontWeight: "600" }}>
                                Medical office TI
                              </td>
                              <td style={{ padding: "11px 10px", color: "#474B53" }}>
                                Drywall
                              </td>
                              <td style={{ padding: "11px 10px", color: "#474B53" }}>
                                Pasadena
                              </td>
                              <td className="num" style={{ padding: "11px 10px", color: "#474B53" }}>
                                Oct 31
                              </td>
                              <td style={{ padding: "11px 14px" }}>
                                <span style={{ padding: "3px 8px", borderRadius: "5px", background: "#EEF2F7", color: "#33445C", fontSize: "12px", fontWeight: "600" }}>
                                  Submitted
                                </span>
                              </td>
                            </tr>
                            <tr style={{ borderTop: "1px solid #F0EBE2" }}>
                              <td style={{ padding: "11px 14px", fontWeight: "600" }}>
                                Civic center roof
                              </td>
                              <td style={{ padding: "11px 10px", color: "#474B53" }}>
                                Roofing
                              </td>
                              <td style={{ padding: "11px 10px", color: "#474B53" }}>
                                Riverside
                              </td>
                              <td className="num" style={{ padding: "11px 10px", color: "#474B53" }}>
                                Nov 12
                              </td>
                              <td style={{ padding: "11px 14px" }}>
                                <span style={{ padding: "3px 8px", borderRadius: "5px", background: "#FBF3E4", color: "#7A5312", fontSize: "12px", fontWeight: "600" }}>
                                  Bidding
                                </span>
                              </td>
                            </tr>
                            <tr style={{ borderTop: "1px solid #F0EBE2" }}>
                              <td style={{ padding: "11px 14px", fontWeight: "600" }}>
                                Warehouse expansion
                              </td>
                              <td style={{ padding: "11px 10px", color: "#474B53" }}>
                                Concrete
                              </td>
                              <td style={{ padding: "11px 10px", color: "#474B53" }}>
                                Ontario
                              </td>
                              <td className="num" style={{ padding: "11px 10px", color: "#474B53" }}>
                                Nov 19
                              </td>
                              <td style={{ padding: "11px 14px" }}>
                                <span style={{ padding: "3px 8px", borderRadius: "5px", background: "#F3EEE4", color: "#4A5462", fontSize: "12px", fontWeight: "600" }}>
                                  Matched
                                </span>
                              </td>
                            </tr>
                            <tr style={{ borderTop: "1px solid #F0EBE2" }}>
                              <td style={{ padding: "11px 14px", fontWeight: "600" }}>
                                School modernization
                              </td>
                              <td style={{ padding: "11px 10px", color: "#474B53" }}>
                                Electrical
                              </td>
                              <td style={{ padding: "11px 10px", color: "#474B53" }}>
                                Long Beach
                              </td>
                              <td className="num" style={{ padding: "11px 10px", color: "#474B53" }}>
                                Dec 3
                              </td>
                              <td style={{ padding: "11px 14px" }}>
                                <span style={{ padding: "3px 8px", borderRadius: "5px", background: "#111926", color: "#FFFFFF", fontSize: "12px", fontWeight: "600" }}>
                                  Awarded
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div style={{ flex: "1 1 260px", minWidth: "0", border: "1px solid #E8E2D6", borderRadius: "8px", overflow: "hidden" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "12px 14px", borderBottom: "1px solid #E8E2D6" }}>
                        <span style={{ fontSize: "14px", fontWeight: "600" }}>
                          Quote comparison
                        </span>
                        <span style={{ fontSize: "12.5px", color: "#5E626B" }}>
                          Electrical rough-in · Medical office TI
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "11px 14px", borderBottom: "1px solid #F0EBE2", fontSize: "13px" }}>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontWeight: "600" }}>
                            Sample Electric Supply
                          </span>
                          <span style={{ fontSize: "12px", color: "#5E626B" }}>
                            Delivers in 3 days
                          </span>
                        </span>
                        <span className="num" style={{ fontWeight: "700" }}>
                          $1,842
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "11px 14px", borderBottom: "1px solid #F0EBE2", background: "#FBF6EC", fontSize: "13px" }}>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontWeight: "600" }}>
                            Example Wire Mfg.
                          </span>
                          <span style={{ fontSize: "12px", color: "#5E626B" }}>
                            Delivers in 5 days
                          </span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ padding: "2px 7px", borderRadius: "5px", background: "#F1E5CC", color: "#7E5C24", fontSize: "11.5px", fontWeight: "600" }}>
                            Lowest
                          </span>
                          <span className="num" style={{ fontWeight: "700" }}>
                            $1,790
                          </span>
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "11px 14px", fontSize: "13px" }}>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontWeight: "600" }}>
                            Sample Trade Distributors
                          </span>
                          <span style={{ fontSize: "12px", color: "#5E626B" }}>
                            Delivers in 2 days
                          </span>
                        </span>
                        <span className="num" style={{ fontWeight: "700" }}>
                          $1,965
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ margin: "56px 0 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "16px" }}>
              <Link to="/solutions" className="card more" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "22px 24px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderTop: "3px solid #B8893B", borderRadius: "10px", color: "#111926" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.12em", color: "#5E626B" }}>
                  FOR GENERAL CONTRACTORS
                </span>
                <span style={{ fontSize: "18px", lineHeight: "1.35", fontWeight: "700", letterSpacing: "-0.01em" }}>
                  Post the work, compare bids, and keep RFIs and deadlines in one place.
                </span>
                <span style={{ marginTop: "auto", paddingTop: "6px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600" }}>
                  How GCs use Stratagem
                  <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                  </svg>
                </span>
              </Link>
              <Link to="/solutions" className="card more" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "22px 24px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderTop: "3px solid #B8893B", borderRadius: "10px", color: "#111926" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.12em", color: "#5E626B" }}>
                  FOR SUBCONTRACTORS
                </span>
                <span style={{ fontSize: "18px", lineHeight: "1.35", fontWeight: "700", letterSpacing: "-0.01em" }}>
                  See work that fits your trade and region, bid it faster, and follow up until it's yours.
                </span>
                <span style={{ marginTop: "auto", paddingTop: "6px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600" }}>
                  How subs use Stratagem
                  <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                  </svg>
                </span>
              </Link>
              <Link to="/solutions" className="card more" style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "22px 24px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderTop: "3px solid #B8893B", borderRadius: "10px", color: "#111926" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.12em", color: "#5E626B" }}>
                  FOR SUPPLIERS
                </span>
                <span style={{ fontSize: "18px", lineHeight: "1.35", fontWeight: "700", letterSpacing: "-0.01em" }}>
                  Answer requests for quote, list stock and price sheets, and get found by buyers.
                </span>
                <span style={{ marginTop: "auto", paddingTop: "6px", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600" }}>
                  How suppliers use Stratagem
                  <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </section>
        <section id="platform" aria-labelledby="co-platform" style={{ background: "#F8F3EA", borderTop: "1px solid #E8E2D6", borderBottom: "1px solid #E8E2D6" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "112px clamp(20px, 4vw, 40px)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "20px 56px", marginBottom: "48px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "640px" }}>
                <span style={{ fontSize: "12.5px", fontWeight: "600", letterSpacing: "0.14em", color: "rgb(127,95,41)" }}>
                  THE PLATFORM
                </span>
                <h2 id="co-platform" style={{ margin: "0", fontFamily: "'Inter Tight', 'Inter', sans-serif", fontSize: "clamp(32px, 3.6vw, 50px)", lineHeight: "1.06", fontWeight: "700", letterSpacing: "-0.03em" }}>
                  Software for the whole pursuit.
                </h2>
              </div>
              <p style={{ margin: "0", maxWidth: "46ch", fontSize: "16.5px", lineHeight: "1.6", color: "#474B53" }}>
                Four tools in one account, from the first lead to the job you win.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(250px, 100%), 1fr))", gap: "16px" }}>
              <Link to="/projects" className="card more" style={{ display: "flex", flexDirection: "column", gap: "14px", minHeight: "236px", padding: "24px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderRadius: "10px", color: "#111926" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21.5S5.5 15.6 5.5 10.4a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11.1-6.5 11.1zM12 12.6a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z" fill="none" stroke="#111926" strokeWidth="1.6" />
                </svg>
                <span style={{ fontSize: "19px", fontWeight: "700", letterSpacing: "-0.01em" }}>
                  Projects
                </span>
                <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#474B53" }}>
                  Open construction work by city and trade, across Southern California.
                </span>
                <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600" }}>
                  Browse projects
                  <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                  </svg>
                </span>
              </Link>
              <Link to="/platform" className="card more" style={{ display: "flex", flexDirection: "column", gap: "14px", minHeight: "236px", padding: "24px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderRadius: "10px", color: "#111926" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 4.5h18v15H3zM9 4.5v15M15 4.5v15M4.8 8h2.4M10.8 8h2.4M16.8 8h2.4" fill="none" stroke="#111926" strokeWidth="1.6" />
                </svg>
                <span style={{ fontSize: "19px", fontWeight: "700", letterSpacing: "-0.01em" }}>
                  Platform
                </span>
                <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#474B53" }}>
                  The workspace where bids, jobs and customers live together.
                </span>
                <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600" }}>
                  See the workspace
                  <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                  </svg>
                </span>
              </Link>
              <Link to="/solutions" className="card more" style={{ display: "flex", flexDirection: "column", gap: "14px", minHeight: "236px", padding: "24px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderRadius: "10px", color: "#111926" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4.5 5a2 2 0 0 1 2-2h13v15h-13a2 2 0 0 0-2 2zM4.5 5v15M8.5 7h7M8.5 10.5h5" fill="none" stroke="#111926" strokeWidth="1.6" />
                </svg>
                <span style={{ fontSize: "19px", fontWeight: "700", letterSpacing: "-0.01em" }}>
                  Solutions
                </span>
                <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#474B53" }}>
                  Playbooks for your trade and the way you win work.
                </span>
                <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600" }}>
                  Find your playbook
                  <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                  </svg>
                </span>
              </Link>
              <Link to="/supply" className="card more" style={{ display: "flex", flexDirection: "column", gap: "14px", minHeight: "236px", padding: "24px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderRadius: "10px", color: "#111926" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5zM3.5 7.5L12 12l8.5-4.5M12 12v9" fill="none" stroke="#111926" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: "19px", fontWeight: "700", letterSpacing: "-0.01em" }}>
                  Supply
                </span>
                <span style={{ fontSize: "15px", lineHeight: "1.55", color: "#474B53" }}>
                  Source materials from suppliers and distributors on the network.
                </span>
                <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600" }}>
                  Source materials
                  <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                  </svg>
                </span>
              </Link>
            </div>
            <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px 28px", padding: "20px 24px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderRadius: "10px" }}>
              <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                <g fill="#111926">
                  <circle cx="5" cy="5" r="2.2" />
                  <circle cx="13" cy="5" r="2.2" />
                  <circle cx="21" cy="5" r="2.2" />
                  <circle cx="5" cy="13" r="2.2" />
                  <circle cx="13" cy="13" r="2.2" />
                  <circle cx="21" cy="13" r="2.2" />
                  <circle cx="5" cy="21" r="2.2" />
                  <circle cx="13" cy="21" r="2.2" />
                </g>
                <circle cx="21" cy="21" r="2.2" fill="#B8893B" />
              </svg>
              <p style={{ flex: "1 1 520px", margin: "0", fontSize: "15.5px", lineHeight: "1.55", color: "#474B53" }}>
                <strong style={{ color: "#111926", fontWeight: "700" }}>
                  Stratagem AI.
                </strong>
                {" "}Hand a job to nine subagents. An admin approves it before anything runs, and you get one written plan back. Planning and drafting only: nothing is booked, bought, funded, or submitted for you.
              </p>
              <Link to="/register" className="more" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600", color: "#111926" }}>
                Submit a job
                <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        <section id="companies" aria-labelledby="co-companies" style={{ background: "#FFFFFF" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "112px clamp(20px, 4vw, 40px)" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "20px 56px", marginBottom: "48px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "640px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontSize: "16px", fontWeight: "800", letterSpacing: "0.16em", color: "rgb(127,95,41)" }}>
                  <span aria-hidden="true" style={{ width: "28px", height: "3px", borderRadius: "2px", background: "#B8893B" }} />
                  ONE ACCOUNT. EVERY PART OF THE JOB.
                </span>
                <h2 id="co-companies" style={{ margin: "0", fontFamily: "'Inter Tight', 'Inter', sans-serif", fontSize: "clamp(26px, 2.6vw, 36px)", lineHeight: "1.12", fontWeight: "700", letterSpacing: "-0.025em" }}>
                  Five companies, built to work together.
                </h2>
              </div>
              <p style={{ margin: "0", maxWidth: "46ch", fontSize: "17px", lineHeight: "1.55", fontWeight: "700", color: "#111926" }}>
                Each Stratagem company does one thing well. Your account, your projects, and your history carry across all of them.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              <article className="card" style={{ flex: "2 1 600px", minWidth: "0", display: "flex", flexDirection: "column", border: "1px solid #E8E2D6", borderRadius: "12px", overflow: "hidden", background: "#FFFFFF" }}>
                <div aria-hidden="true" style={{ minHeight: "250px", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "linear-gradient(90deg, #ECEDF0 0%, #EFE7D7 100%)", borderBottom: "1px solid #E8E2D6" }}>
                  <div style={{ width: "100%", maxWidth: "580px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderRadius: "8px", boxShadow: "0 8px 24px rgba(17,25,38,0.07)", overflow: "hidden", fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "11px 14px", borderBottom: "1px solid #E8E2D6" }}>
                      <span style={{ fontWeight: "600" }}>
                        Request for quote · Electrical rough-in
                      </span>
                      <span style={{ padding: "2px 7px", borderRadius: "5px", background: "#F3EEE4", color: "#5E626B", fontSize: "11.5px", fontWeight: "600" }}>
                        Sample
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 90px", padding: "8px 14px", background: "#FBF9F5", color: "#5E626B", fontSize: "12px" }}>
                      <span>
                        Item
                      </span>
                      <span style={{ textAlign: "right" }}>
                        Qty
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 90px", padding: "9px 14px", borderTop: "1px solid #F0EBE2" }}>
                      <span>
                        12/2 MC cable
                      </span>
                      <span className="num" style={{ textAlign: "right" }}>
                        500 ft
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 90px", padding: "9px 14px", borderTop: "1px solid #F0EBE2" }}>
                      <span>
                        EMT conduit, 3/4 in.
                      </span>
                      <span className="num" style={{ textAlign: "right" }}>
                        400 ft
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 90px", padding: "9px 14px", borderTop: "1px solid #F0EBE2" }}>
                      <span>
                        Single-pole switch, 20 A
                      </span>
                      <span className="num" style={{ textAlign: "right" }}>
                        48
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "10px 14px", borderTop: "1px solid #E8E2D6", background: "#FBF6EC", fontSize: "12.5px" }}>
                      <span style={{ color: "#7E5C24", fontWeight: "600" }}>
                        3 quotes received
                      </span>
                      <span className="num" style={{ fontWeight: "600" }}>
                        Lowest $1,790
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "10px", padding: "24px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.12em", color: "#5E626B" }}>
                    STRATAGEM EXCHANGE
                  </span>
                  <h3 style={{ margin: "0", fontSize: "22px", fontWeight: "700", letterSpacing: "-0.015em" }}>
                    The B2B supply network for construction.
                  </h3>
                  <p style={{ margin: "0", maxWidth: "62ch", fontSize: "15px", lineHeight: "1.6", color: "#474B53" }}>
                    Manufacturers, distributors, and contractors buy and sell materials on one marketplace. Contractors post what the job needs; sellers quote it.
                  </p>
                  <div style={{ marginTop: "auto", paddingTop: "14px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "4px 10px", border: "1px solid #E8E2D6", borderRadius: "999px", fontSize: "12.5px", fontWeight: "500", color: "#474B53" }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#1F9D63" }} />
                      Onboarding early members
                    </span>
                    <Link to="/exchange" className="more" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600", color: "#111926" }}>
                      Visit Exchange
                      <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
              <article className="card" style={{ flex: "1 1 340px", minWidth: "0", display: "flex", flexDirection: "column", border: "1px solid #E8E2D6", borderRadius: "12px", overflow: "hidden", background: "#FFFFFF" }}>
                <div style={{ minHeight: "250px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "20px 14px", background: "#FFFFFF", borderBottom: "1px solid #E8E2D6" }}>
                  <figure style={{ flex: "1 1 0", minWidth: "0", margin: "0", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <img src="/media/vehicles/ram.webp" alt="White heavy-duty crew-cab pickup truck" style={{ display: "block", width: "100%", height: "auto", aspectRatio: "16 / 9", objectFit: "contain" }} />
                    <figcaption style={{ fontSize: "12px", color: "#5E626B" }}>
                      Heavy-duty pickup
                    </figcaption>
                  </figure>
                  <figure style={{ flex: "1 1 0", minWidth: "0", margin: "0", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <img src="/media/vehicles/sprinter.webp" alt="White high-roof Sprinter van" style={{ display: "block", width: "100%", height: "auto", aspectRatio: "16 / 9", objectFit: "contain" }} />
                    <figcaption style={{ fontSize: "12px", color: "#5E626B" }}>
                      Sprinter van
                    </figcaption>
                  </figure>
                </div>
                <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "10px", padding: "24px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.12em", color: "#5E626B" }}>
                    STRATAGEM FLEET
                  </span>
                  <h3 style={{ margin: "0", fontSize: "22px", fontWeight: "700", letterSpacing: "-0.015em" }}>
                    The right trucks for the job.
                  </h3>
                  <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#474B53" }}>
                    Heavy-duty pickups, Sprinter and Transit vans, and full-size SUVs, planned and reserved for your jobs across Southern California.
                  </p>
                  <div style={{ marginTop: "auto", paddingTop: "14px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "4px 10px", border: "1px solid #E8E2D6", borderRadius: "999px", fontSize: "12.5px", fontWeight: "500", color: "#474B53" }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#B8893B" }} />
                      Taking reservation requests
                    </span>
                    <Link to="/fleet" className="more" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600", color: "#111926" }}>
                      Visit Fleet
                      <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
              <article className="card" style={{ flex: "1 1 300px", minWidth: "0", display: "flex", flexDirection: "column", border: "1px solid #E8E2D6", borderRadius: "12px", overflow: "hidden", background: "#FFFFFF" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "22px 24px", background: "#F8F3EA", borderBottom: "1px solid #E8E2D6" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: "600", letterSpacing: "0.12em", color: "#5E626B" }}>
                    PLANNED SCOPE
                  </span>
                  <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px", fontWeight: "500" }}>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span aria-hidden="true" style={{ width: "14px", height: "2px", background: "#B8893B" }} />
                      Pay applications
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span aria-hidden="true" style={{ width: "14px", height: "2px", background: "#B8893B" }} />
                      Retainage
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span aria-hidden="true" style={{ width: "14px", height: "2px", background: "#B8893B" }} />
                      Materials bought ahead of payment
                    </li>
                  </ul>
                </div>
                <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "10px", padding: "24px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.12em", color: "#5E626B" }}>
                    STRATAGEM CAPITAL
                  </span>
                  <h3 style={{ margin: "0", fontSize: "21px", fontWeight: "700", letterSpacing: "-0.015em" }}>
                    Get paid sooner. Bid bigger.
                  </h3>
                  <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#474B53" }}>
                    Working capital built around how construction actually gets paid.
                  </p>
                  <p style={{ margin: "0", fontSize: "13px", lineHeight: "1.5", color: "#5E626B" }}>
                    Stratagem Capital does not offer credit, loans, or bonds today.
                  </p>
                  <div style={{ marginTop: "auto", paddingTop: "14px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "4px 10px", border: "1px solid #E8E2D6", borderRadius: "999px", fontSize: "12.5px", fontWeight: "500", color: "#474B53" }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#8A94A3" }} />
                      In development
                    </span>
                    <Link to="/capital" className="more" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600", color: "#111926" }}>
                      Learn more
                      <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
              <article className="card" style={{ flex: "1 1 300px", minWidth: "0", display: "flex", flexDirection: "column", border: "1px solid #E8E2D6", borderRadius: "12px", overflow: "hidden", background: "#FFFFFF" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "22px 24px", background: "#F8F3EA", borderBottom: "1px solid #E8E2D6" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: "600", letterSpacing: "0.12em", color: "#5E626B" }}>
                    PLANNED SCOPE
                  </span>
                  <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px", fontWeight: "500" }}>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span aria-hidden="true" style={{ width: "14px", height: "2px", background: "#B8893B" }} />
                      Skilled-trades staffing
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span aria-hidden="true" style={{ width: "14px", height: "2px", background: "#B8893B" }} />
                      Matched to work you've won
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span aria-hidden="true" style={{ width: "14px", height: "2px", background: "#B8893B" }} />
                      Credentials checked before day one
                    </li>
                  </ul>
                </div>
                <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "10px", padding: "24px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.12em", color: "#5E626B" }}>
                    STRATAGEM WORKFORCE
                  </span>
                  <h3 style={{ margin: "0", fontSize: "21px", fontWeight: "700", letterSpacing: "-0.015em" }}>
                    The right crew, on the right day.
                  </h3>
                  <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#474B53" }}>
                    Staffing that plugs into the projects you're already winning.
                  </p>
                  <div style={{ marginTop: "auto", paddingTop: "14px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "4px 10px", border: "1px solid #E8E2D6", borderRadius: "999px", fontSize: "12.5px", fontWeight: "500", color: "#474B53" }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#8A94A3" }} />
                      In development
                    </span>
                    <Link to="/workforce" className="more" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600", color: "#111926" }}>
                      Learn more
                      <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
              <article className="card" style={{ flex: "1 1 300px", minWidth: "0", display: "flex", flexDirection: "column", border: "1px solid #E8E2D6", borderRadius: "12px", overflow: "hidden", background: "#FFFFFF" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "22px 24px", background: "#F8F3EA", borderBottom: "1px solid #E8E2D6" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: "600", letterSpacing: "0.12em", color: "#5E626B" }}>
                    PLANNED SCOPE
                  </span>
                  <ul style={{ listStyle: "none", margin: "0", padding: "0", display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px", fontWeight: "500" }}>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span aria-hidden="true" style={{ width: "14px", height: "2px", background: "#B8893B" }} />
                      Brand identity
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span aria-hidden="true" style={{ width: "14px", height: "2px", background: "#B8893B" }} />
                      Company website
                    </li>
                    <li style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span aria-hidden="true" style={{ width: "14px", height: "2px", background: "#B8893B" }} />
                      Bid documents
                    </li>
                  </ul>
                </div>
                <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "10px", padding: "24px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.12em", color: "#5E626B" }}>
                    STRATAGEM STUDIO
                  </span>
                  <h3 style={{ margin: "0", fontSize: "21px", fontWeight: "700", letterSpacing: "-0.015em" }}>
                    Look like the firm that wins.
                  </h3>
                  <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#474B53" }}>
                    Made by people who understand how owners and GCs choose who to hire.
                  </p>
                  <div style={{ marginTop: "auto", paddingTop: "14px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "4px 10px", border: "1px solid #E8E2D6", borderRadius: "999px", fontSize: "12.5px", fontWeight: "500", color: "#474B53" }}>
                      <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#8A94A3" }} />
                      In development
                    </span>
                    <Link to="/studio" className="more" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "600", color: "#111926" }}>
                      Learn more
                      <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#111926" strokeWidth="1.6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section id="how" aria-labelledby="co-how" style={{ background: "radial-gradient(900px 420px at 62% 0%, rgba(240,226,200,0.85), rgba(255,255,255,0) 70%), #FFFFFF", borderTop: "1px solid #EFE8DC", borderBottom: "1px solid #EFE8DC" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "112px clamp(20px, 4vw, 40px)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "640px", marginBottom: "52px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "12px", fontSize: "16px", fontWeight: "800", letterSpacing: "0.16em", color: "rgb(127,95,41)" }}>
                <span aria-hidden="true" style={{ width: "28px", height: "3px", borderRadius: "2px", background: "#B8893B" }} />
                HOW IT WORKS
              </span>
              <h2 id="co-how" style={{ margin: "0", fontFamily: "'Inter Tight', 'Inter', sans-serif", fontSize: "clamp(26px, 2.6vw, 36px)", lineHeight: "1.12", fontWeight: "700", letterSpacing: "-0.025em" }}>
                From first profile to the next win.
              </h2>
            </div>
            <ol style={{ listStyle: "none", margin: "0", padding: "0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gap: "16px" }}>
              <li style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "24px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderRadius: "10px" }}>
                <span aria-hidden="true" style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0) 60%), linear-gradient(145deg, rgba(184,137,59,0.32), rgba(184,137,59,0.1))", border: "1px solid rgba(184,137,59,0.42)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -6px 12px rgba(184,137,59,0.14), 0 6px 14px rgba(184,137,59,0.22)", backdropFilter: "blur(8px) saturate(150%)", color: "rgb(114,85,37)", fontSize: "14px", fontWeight: "700" }}>
                  1
                </span>
                <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "700", letterSpacing: "-0.01em" }}>
                  Create your account
                </h3>
                <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#474B53" }}>
                  Tell us your trades, service area, and what you buy or sell. A person reviews every account.
                </p>
                <p style={{ margin: "auto 0 0", paddingTop: "14px", borderTop: "1px solid #F0EBE2", display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: "600", letterSpacing: "0.12em", color: "#5E626B" }}>
                    YOU GET
                  </span>
                  <span style={{ fontSize: "14.5px", fontWeight: "600" }}>
                    A reviewed company profile
                  </span>
                </p>
              </li>
              <li style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "24px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderRadius: "10px" }}>
                <span aria-hidden="true" style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0) 60%), linear-gradient(145deg, rgba(184,137,59,0.32), rgba(184,137,59,0.1))", border: "1px solid rgba(184,137,59,0.42)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -6px 12px rgba(184,137,59,0.14), 0 6px 14px rgba(184,137,59,0.22)", backdropFilter: "blur(8px) saturate(150%)", color: "rgb(114,85,37)", fontSize: "14px", fontWeight: "700" }}>
                  2
                </span>
                <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "700", letterSpacing: "-0.01em" }}>
                  Get matched
                </h3>
                <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#474B53" }}>
                  Projects and requests that fit your work come to you, ranked by fit.
                </p>
                <p style={{ margin: "auto 0 0", paddingTop: "14px", borderTop: "1px solid #F0EBE2", display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: "600", letterSpacing: "0.12em", color: "#5E626B" }}>
                    YOU GET
                  </span>
                  <span style={{ fontSize: "14.5px", fontWeight: "600" }}>
                    Work ranked by fit
                  </span>
                </p>
              </li>
              <li style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "24px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderRadius: "10px" }}>
                <span aria-hidden="true" style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0) 60%), linear-gradient(145deg, rgba(184,137,59,0.32), rgba(184,137,59,0.1))", border: "1px solid rgba(184,137,59,0.42)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -6px 12px rgba(184,137,59,0.14), 0 6px 14px rgba(184,137,59,0.22)", backdropFilter: "blur(8px) saturate(150%)", color: "rgb(114,85,37)", fontSize: "14px", fontWeight: "700" }}>
                  3
                </span>
                <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "700", letterSpacing: "-0.01em" }}>
                  Bid, quote, and book
                </h3>
                <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#474B53" }}>
                  Bids, material quotes, crews, and vehicles live in one record.
                </p>
                <p style={{ margin: "auto 0 0", paddingTop: "14px", borderTop: "1px solid #F0EBE2", display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: "600", letterSpacing: "0.12em", color: "#5E626B" }}>
                    YOU GET
                  </span>
                  <span style={{ fontSize: "14.5px", fontWeight: "600" }}>
                    One record for every job
                  </span>
                </p>
              </li>
              <li style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "24px", background: "#FFFFFF", border: "1px solid #E8E2D6", borderRadius: "10px" }}>
                <span aria-hidden="true" style={{ width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", background: "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0) 60%), linear-gradient(145deg, rgba(184,137,59,0.32), rgba(184,137,59,0.1))", border: "1px solid rgba(184,137,59,0.42)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -6px 12px rgba(184,137,59,0.14), 0 6px 14px rgba(184,137,59,0.22)", backdropFilter: "blur(8px) saturate(150%)", color: "rgb(114,85,37)", fontSize: "14px", fontWeight: "700" }}>
                  4
                </span>
                <h3 style={{ margin: "0", fontSize: "18px", fontWeight: "700", letterSpacing: "-0.01em" }}>
                  Keep the customer
                </h3>
                <p style={{ margin: "0", fontSize: "15px", lineHeight: "1.6", color: "#474B53" }}>
                  Every job builds your history for the next one.
                </p>
                <p style={{ margin: "auto 0 0", paddingTop: "14px", borderTop: "1px solid #F0EBE2", display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ fontSize: "11.5px", fontWeight: "600", letterSpacing: "0.12em", color: "#5E626B" }}>
                    YOU GET
                  </span>
                  <span style={{ fontSize: "14.5px", fontWeight: "600" }}>
                    A track record to bid with
                  </span>
                </p>
              </li>
            </ol>
          </div>
        </section>
        <section id="company" aria-labelledby="co-company" style={{ color: "#FFFFFF", backgroundColor: "#2B3542", backgroundImage: "radial-gradient(65% 95% at 100% 100%, rgba(226,206,176,0.95), rgba(226,206,176,0) 70%), radial-gradient(55% 85% at 0% 100%, rgba(58,58,62,0.7), rgba(58,58,62,0) 70%), linear-gradient(100deg, #2B3542 0%, #313D4D 30%, #4F5B6C 50%, #8A9AAE 75%, #A3B4C8 92%)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "112px clamp(20px, 4vw, 40px)", display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "48px 72px" }}>
            <div style={{ flex: "1 1 420px", minWidth: "0", display: "flex", flexDirection: "column", gap: "18px" }}>
              <span style={{ fontSize: "12.5px", fontWeight: "600", letterSpacing: "0.14em", color: "#D9B26E" }}>
                THE COMPANY
              </span>
              <h2 id="co-company" style={{ margin: "0", color: "#FFFFFF", fontFamily: "'Inter Tight', 'Inter', sans-serif", fontSize: "clamp(32px, 3.6vw, 50px)", lineHeight: "1.06", fontWeight: "700", letterSpacing: "-0.03em" }}>
                Built by people who work in construction.
              </h2>
              <p style={{ margin: "0", maxWidth: "52ch", fontSize: "16.5px", lineHeight: "1.65", color: "#C8CED6" }}>
                D&J Stratagem, Inc. is a Los Angeles company building tools for the trades and the suppliers who serve them. One account covers the platform and every Stratagem company.
              </p>
              <Link to="/about" className="more" style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "6px", fontSize: "14.5px", fontWeight: "600", color: "#FFFFFF" }}>
                About D&J Stratagem
                <svg className="arw" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M2 7H11M8 4L11 7L8 10" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
                </svg>
              </Link>
            </div>
            <dl style={{ flex: "1 1 460px", minWidth: "0", margin: "0", padding: "4px 26px", background: "rgba(17,25,38,0.6)", backdropFilter: "blur(14px) saturate(140%)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "14px", boxShadow: "0 24px 60px rgba(17,25,38,0.35), inset 0 1px 0 rgba(255,255,255,0.12)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 24px", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
                <dt style={{ flex: "0 0 150px", fontSize: "13.5px", color: "#A9B1BC" }}>
                  Legal name
                </dt>
                <dd style={{ flex: "1 1 220px", margin: "0", fontSize: "15.5px", fontWeight: "500" }}>
                  D&J Stratagem, Inc.
                </dd>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 24px", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
                <dt style={{ flex: "0 0 150px", fontSize: "13.5px", color: "#A9B1BC" }}>
                  Headquarters
                </dt>
                <dd style={{ flex: "1 1 220px", margin: "0", fontSize: "15.5px", fontWeight: "500" }}>
                  Los Angeles, California
                </dd>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 24px", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
                <dt style={{ flex: "0 0 150px", fontSize: "13.5px", color: "#A9B1BC" }}>
                  Service area
                </dt>
                <dd style={{ flex: "1 1 220px", margin: "0", fontSize: "15.5px", fontWeight: "500" }}>
                  Southern California
                </dd>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 24px", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
                <dt style={{ flex: "0 0 150px", fontSize: "13.5px", color: "#A9B1BC" }}>
                  Platform
                </dt>
                <dd style={{ flex: "1 1 220px", margin: "0", fontSize: "15.5px", fontWeight: "500" }}>
                  Projects · Platform · Solutions · Supply
                </dd>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 24px", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.14)" }}>
                <dt style={{ flex: "0 0 150px", fontSize: "13.5px", color: "#A9B1BC" }}>
                  Companies
                </dt>
                <dd style={{ flex: "1 1 220px", margin: "0", fontSize: "15.5px", fontWeight: "500" }}>
                  Exchange · Fleet · Capital · Workforce · Studio
                </dd>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 24px", padding: "16px 0" }}>
                <dt style={{ flex: "0 0 150px", fontSize: "13.5px", color: "#A9B1BC" }}>
                  General inquiries
                </dt>
                <dd style={{ flex: "1 1 220px", margin: "0", fontSize: "15.5px", fontWeight: "500" }}>
                  <a className="ul" href="mailto:hello@djstratageminc.com" style={{ color: "#FFFFFF" }}>
                    hello@djstratageminc.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>
        <section aria-labelledby="co-cta" style={{ background: "#FFFFFF" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "104px clamp(20px, 4vw, 40px)", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "28px 48px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "640px" }}>
              <h2 id="co-cta" style={{ margin: "0", fontFamily: "'Inter Tight', 'Inter', sans-serif", fontSize: "clamp(30px, 3.4vw, 46px)", lineHeight: "1.08", fontWeight: "700", letterSpacing: "-0.03em" }}>
                Put your company on Stratagem.
              </h2>
              <p style={{ margin: "0", fontSize: "16.5px", lineHeight: "1.6", color: "#474B53" }}>
                Free to start. A person reviews every account before it goes live.
              </p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <Link to="/register" className="btn btn-ink" style={{ display: "inline-flex", alignItems: "center", minHeight: "48px", padding: "0 22px", background: "#111926", color: "#FFFFFF", borderRadius: "6px", fontSize: "15.5px", fontWeight: "600" }}>
                Create your account
              </Link>
              <Link to="/contact" className="btn btn-line" style={{ display: "inline-flex", alignItems: "center", minHeight: "48px", padding: "0 20px", border: "1px solid #DCD5C8", borderRadius: "6px", color: "#111926", fontSize: "15.5px", fontWeight: "600" }}>
                Talk to our team
              </Link>
            </div>
          </div>
        </section>
        <footer style={{ background: "#F8F3EA", borderTop: "1px solid #E8E2D6" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px clamp(20px, 4vw, 40px) 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(170px, 100%), 1fr))", gap: "36px 28px", fontSize: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <svg width="26" height="26" viewBox="0 0 30 30" aria-hidden="true">
                  <rect width="30" height="30" rx="7" fill="#111926" />
                  <path d="M8 20.5L15 8.5L22 20.5" fill="none" stroke="#FFFFFF" strokeWidth="2.6" strokeLinejoin="round" />
                  <path d="M10.5 23H19.5" stroke="#B8893B" strokeWidth="2.2" />
                </svg>
                <span style={{ fontFamily: "'Inter Tight', 'Inter', sans-serif", fontSize: "17px", fontWeight: "700", letterSpacing: "-0.02em" }}>
                  Stratagem
                </span>
              </span>
              <span style={{ lineHeight: "1.6", color: "#474B53" }}>
                D&J Stratagem, Inc.
                <br />
                Los Angeles, California
              </span>
              <a className="ul" href="mailto:hello@djstratageminc.com" style={{ color: "rgb(127,95,41)", fontWeight: "600" }}>
                hello@djstratageminc.com
              </a>
            </div>
            <nav aria-label="Platform" style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              <span style={{ fontWeight: "700" }}>
                Platform
              </span>
              <Link to="/projects" className="lk">
                Projects
              </Link>
              <Link to="/platform" className="lk">
                Bids and jobs
              </Link>
              <Link to="/solutions" className="lk">
                Solutions
              </Link>
              <Link to="/supply" className="lk">
                Supply
              </Link>
              <Link to="/pricing" className="lk">
                Pricing
              </Link>
            </nav>
            <nav aria-label="Companies" style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              <span style={{ fontWeight: "700" }}>
                Companies
              </span>
              <Link to="/exchange" className="lk">
                Stratagem Exchange
              </Link>
              <Link to="/fleet" className="lk">
                Stratagem Fleet
              </Link>
              <Link to="/capital" className="lk">
                Stratagem Capital
              </Link>
              <Link to="/workforce" className="lk">
                Stratagem Workforce
              </Link>
              <Link to="/studio" className="lk">
                Stratagem Studio
              </Link>
            </nav>
            <nav aria-label="Company" style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              <span style={{ fontWeight: "700" }}>
                Company
              </span>
              <Link to="/about" className="lk">
                About
              </Link>
              <Link to="/contact" className="lk">
                Contact
              </Link>
              <Link to="/changelog" className="lk">
                Changelog
              </Link>
              <Link to="/brand" className="lk">
                Brand
              </Link>
              <a className="lk" href="mailto:careers@djstratageminc.com">
                Careers
              </a>
            </nav>
            <nav aria-label="Support" style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              <span style={{ fontWeight: "700" }}>
                Support
              </span>
              <Link to="/help" className="lk">
                Help center
              </Link>
              <a className="lk" href="mailto:support@djstratageminc.com">
                support@
              </a>
              <a className="lk" href="mailto:billing@djstratageminc.com">
                billing@
              </a>
              <Link to="/login" className="lk">
                Sign in
              </Link>
            </nav>
            <nav aria-label="Legal" style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              <span style={{ fontWeight: "700" }}>
                Legal
              </span>
              <Link to="/privacy" className="lk">
                Privacy
              </Link>
              <Link to="/terms" className="lk">
                Terms
              </Link>
              <Link to="/privacy#cookies" className="lk">
                Cookie settings
              </Link>
            </nav>
          </div>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(20px, 4vw, 40px)" }}>
            <div style={{ marginTop: "56px", padding: "22px 0 30px", borderTop: "1px solid #E8E2D6", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "8px 24px", fontSize: "13px", color: "#5E626B" }}>
              <span>
                © 2026 D&J Stratagem, Inc. All rights reserved.
              </span>
              <span>
                Los Angeles, California
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

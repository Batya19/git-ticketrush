// מחירון TicketRush
const TICKET_PRICE = 350; // ₪ לכרטיס
const SERVICE_FEE = 12;   // ₪ עמלת שירות לכל כרטיס
const MAX_TICKETS = 8;    // מקסימום כרטיסים להזמנה (לקוחה רגילה)
const MEMBER_MAX_TICKETS = 4;   // מקסימום כרטיסים להזמנה (חברת מועדון)
const MEMBER_DISCOUNT = 0.2;    // 20% הנחה לחברות מועדון על מחיר הכרטיס בלבד

function maxTickets(isMember) {
  return isMember ? MEMBER_MAX_TICKETS : MAX_TICKETS;
}

function calcTotal(qty, isMember) {
  if (qty < 1 || qty > maxTickets(isMember)) return null;
  const ticketPrice = isMember ? TICKET_PRICE * (1 - MEMBER_DISCOUNT) : TICKET_PRICE;
  return qty * (ticketPrice + SERVICE_FEE);
}

if (typeof module !== 'undefined') {
  module.exports = { TICKET_PRICE, SERVICE_FEE, MAX_TICKETS, MEMBER_MAX_TICKETS, MEMBER_DISCOUNT, maxTickets, calcTotal };
}

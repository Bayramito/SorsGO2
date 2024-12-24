export const getDayName = planDay => {
  switch (planDay) {
    case '1':
      return 'Pazartesi';
    case '2':
      return 'Salı';
    case '3':
      return 'Çarşamba';
    case '4':
      return 'Perşembe';
    case '5':
      return 'Cuma';
    case '6':
      return 'Cumartesi';
    case '7':
      return 'Pazar';
    default:
      return 'Belirlenmemiş';
  }
};

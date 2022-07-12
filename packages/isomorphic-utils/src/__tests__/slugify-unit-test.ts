import { slugify } from '../slugify';

describe('slugify suite', () => {
  test('slugify url : remove inside parenthesis', () => {
    const s = 'La géographie de la France (le plus beau pays du monde)';
    expect(slugify(s)).toBe('geographie-france');
  });
  test('slugify url: remove keywords', () => {
    const s = "La géographie de la France qui que d'un l'une (le plus beau pays du monde)";
    expect(slugify(s)).toBe('geographie-france');
  });
  test("slugify url: Taux de l'usure : 1er avril 2016", () => {
    const s = "Taux de l'usure : 1er avril 2016";
    expect(slugify(s)).toBe('taux-usure-1er-avril-2016');
  });
  test('slugify url: ehpad-la-revolte-des-familles-contre-les-privations-de-liberte', () => {
    const s = 'ehpad la revolte des familles contre les privations de liberte';
    expect(slugify(s)).toBe('ehpad-revolte-familles-contre-privations-liberte');
  });
  test('slugify url: La poursuite provisoire d’un CDD au-delà de son terme ordonnée en référé !', () => {
    const s = 'La poursuite provisoire d’un CDD au-delà de son terme ordonnée en référé !';
    expect(slugify(s)).toBe('poursuite-provisoire-cdd-terme-ordonnee-refere');
  });
  test('slugify metier: Commissaire aux comptes', () => {
    const s = 'Commissaire aux comptes';
    expect(slugify(s)).toBe('commissaire-aux-comptes');
  });
  test('slugify PLDGATEWAY-296: droite essai état pièce valeur voie', () => {
    const s = 'droite essai état pièce valeur voie';
    expect(slugify(s)).toBe('droite-essai-etat-piece-valeur-voie');
  });
  test("slugify SEO: Qu'est-ce que la démission", () => {
    const s = "Qu'est-ce que la démission";
    expect(slugify(s)).toBe('demission');
  });
});

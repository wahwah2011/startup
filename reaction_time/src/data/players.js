export const MOCK_PLAYERS = [
  { name: 'Lavoisier', score: 15 },
  { name: 'Curie', score: 11 },
  { name: 'Dalton', score: 8 },
  { name: 'Mendeleev', score: 5 },
  { name: 'Pasteur', score: 3 },
];

export const RANK_CLASSES = ['rank-gold', 'rank-silver', 'rank-bronze'];

export function buildLeaderboard(userName, userScore, mockPlayers) {
  const combined = [
    ...mockPlayers.map((p) => ({ ...p })),
    { name: userName || 'You', score: userScore, isUser: true },
  ];
  combined.sort((a, b) => b.score - a.score);
  return combined;
}

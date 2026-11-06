describe('Ready for Battle and a rule bowing a character', function () {
    integration(function () {
        it('does not react when an illegal participant is sent home bowed', function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [{ card: 'doji-kuwanan', attachments: ['shukujo'] }]
                },
                player2: {
                    inPlay: ['matsu-berserker'],
                    hand: ['ready-for-battle']
                }
            });
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.kuwanan],
                defenders: [this.berserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.kuwanan);
            this.player1.clickPrompt('Switch the conflict type');

            expect(this.game.currentConflict.conflictType).toBe('political');
            expect(this.berserker.bowed).toBe(true);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
        });
    });
});

describe('Ready for Battle', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger'],
                    hand: ['admit-defeat']
                },
                player2: {
                    inPlay: ['matsu-berserker', 'ikoma-prodigy'],
                    hand: ['ready-for-battle', 'admit-defeat']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.prodigy = this.player2.findCardByName('ikoma-prodigy');
            this.readyForBattle = this.player2.findCardByName('ready-for-battle');
        });

        it('readies a character an opponent\'s card effect bowed', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.berserker]
            });
            this.player2.pass();
            this.player1.clickCard('admit-defeat', 'hand');
            this.player1.clickCard(this.berserker);
            expect(this.berserker.bowed).toBe(true);

            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.readyForBattle);
            expect(this.berserker.bowed).toBe(false);
            expect(this.readyForBattle.location).toBe('conflict discard pile');
            expect(this.getChatLogs(3)).toContain('player2 plays Ready for Battle to ready Matsu Berserker');
        });

        it('does not react when your own card effect bows the character', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.berserker]
            });
            this.player2.clickCard('admit-defeat', 'hand');
            this.player2.clickCard(this.berserker);

            expect(this.berserker.bowed).toBe(true);
            expect(this.getChatLogs(3)).toContain('player2 plays Admit Defeat to bow Matsu Berserker');
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('readies a character a ring effect bowed', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'water',
                attackers: [this.challenger],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickCard(this.prodigy);
            expect(this.prodigy.bowed).toBe(true);

            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.readyForBattle);
            expect(this.prodigy.bowed).toBe(false);
            expect(this.getChatLogs(3)).toContain('player1 resolves the water ring, bowing Ikoma Prodigy');
            expect(this.getChatLogs(3)).toContain('player2 plays Ready for Battle to ready Ikoma Prodigy');
        });
    });
});

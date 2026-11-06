describe('Lancer of the 9th Legion', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['lancer-of-the-9th-legion', 'border-rider'],
                    hand: []
                },
                player2: {
                    inPlay: ['doji-challenger', 'solemn-scholar', 'togashi-yokuni'],
                    hand: []
                }
            });

            this.lancer = this.player1.findCardByName('lancer-of-the-9th-legion');
            this.rider = this.player1.findCardByName('border-rider');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');
        });

        it('should bow an enemy character with equal or lower military skill', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.lancer],
                defenders: [this.challenger, this.scholar]
            });

            this.player2.pass();
            this.player1.clickCard(this.lancer);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.scholar);
            expect(this.player1).not.toBeAbleToSelect(this.yokuni);

            this.player1.clickCard(this.challenger);
            expect(this.challenger.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Lancer of the 9th Legion to bow Doji Challenger');
        });

        it('should not be usable outside a military conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.lancer],
                defenders: [this.challenger]
            });

            this.player2.pass();
            this.player1.clickCard(this.lancer);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should not be usable from home', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.rider],
                defenders: [this.scholar]
            });

            this.player2.pass();
            this.player1.clickCard(this.lancer);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should only target opposing characters', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.lancer, this.rider],
                defenders: [this.scholar]
            });

            this.player2.pass();
            this.player1.clickCard(this.lancer);
            expect(this.player1).not.toBeAbleToSelect(this.rider);
            expect(this.player1).toBeAbleToSelect(this.scholar);
            this.player1.clickCard(this.scholar);
            expect(this.scholar.bowed).toBe(true);
        });
    });
});

describe('Lancer of the 9th Legion with characters on the other side than their controller', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['lancer-of-the-9th-legion', 'endless-plains-skirmisher']
                },
                player2: {
                    inPlay: ['solemn-scholar', 'endless-plains-skirmisher']
                }
            });
            this.lancer = this.player1.findCardByName('lancer-of-the-9th-legion');
            this.skirmisher1 = this.player1.findCardByName('endless-plains-skirmisher');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.skirmisher2 = this.player2.findCardByName('endless-plains-skirmisher');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.lancer],
                defenders: [this.scholar]
            });
            this.player2.clickCard(this.skirmisher2);
            this.player2.clickPrompt('player1');
            this.player1.clickCard(this.skirmisher1);
            this.player1.clickPrompt('player2');
        });

        it('chooses a character on the enemy side, whoever controls it', function () {
            this.player2.pass();
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher2);
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher1);

            this.player1.clickCard(this.lancer);
            expect(this.player1).toBeAbleToSelect(this.scholar);
            expect(this.player1).toBeAbleToSelect(this.skirmisher1);
            expect(this.player1).not.toBeAbleToSelect(this.skirmisher2);
            this.player1.clickCard(this.skirmisher1);
            expect(this.skirmisher1.bowed).toBe(true);
        });
    });
});

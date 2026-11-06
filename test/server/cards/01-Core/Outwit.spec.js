describe('Outwit', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 5,
                    inPlay: ['doji-whisperer', 'valiant-oathkeeper'],
                    hand: ['outwit']
                },
                player2: {
                    inPlay: ['valiant-oathkeeper', 'samurai-of-integrity', 'matsu-berserker']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.oathkeeper = this.player1.findCardByName('valiant-oathkeeper');
            this.outwit = this.player1.findCardByName('outwit');
            this.p2Oathkeeper = this.player2.findCardByName('valiant-oathkeeper');
            this.samurai = this.player2.findCardByName('samurai-of-integrity');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.noMoreActions();
        });

        it('moves home an opponent\'s character with lower political skill than a participating Courtier you control', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.whisperer, this.oathkeeper],
                defenders: [this.p2Oathkeeper, this.samurai, this.berserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.outwit);
            expect(this.player1).toHavePrompt('Outwit');
            expect(this.player1).toBeAbleToSelect(this.p2Oathkeeper);
            expect(this.player1).not.toBeAbleToSelect(this.samurai);
            expect(this.player1).not.toBeAbleToSelect(this.oathkeeper);
            this.player1.clickCard(this.p2Oathkeeper);
            expect(this.p2Oathkeeper.isParticipating()).toBe(false);
            expect(this.p2Oathkeeper.location).toBe('play area');
            expect(this.samurai.isDefending()).toBe(true);
            expect(this.outwit.location).toBe('conflict discard pile');
        });

        it('can choose a character with a dash political skill, counted as 0 (ruling #80)', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.whisperer, this.oathkeeper],
                defenders: [this.p2Oathkeeper, this.samurai, this.berserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.outwit);
            expect(this.player1).toBeAbleToSelect(this.berserker);
            this.player1.clickCard(this.berserker);
            expect(this.berserker.isParticipating()).toBe(false);
        });

        it('still compares with a bowed participating Courtier (ruling #81)', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.whisperer, this.oathkeeper],
                defenders: [this.p2Oathkeeper, this.samurai, this.berserker]
            });
            this.whisperer.bow();
            this.player2.pass();
            expect(this.whisperer.bowed).toBe(true);
            expect(this.whisperer.isParticipating()).toBe(true);
            this.player1.clickCard(this.outwit);
            expect(this.player1).toBeAbleToSelect(this.p2Oathkeeper);
            this.player1.clickCard(this.p2Oathkeeper);
            expect(this.p2Oathkeeper.isParticipating()).toBe(false);
        });

        it('cannot be played without a participating Courtier you control', function() {
            this.initiateConflict({
                type: 'military',
                attackers: [this.oathkeeper],
                defenders: [this.p2Oathkeeper, this.berserker]
            });
            this.player2.pass();
            this.player1.clickCard(this.outwit);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.outwit.location).toBe('hand');
            expect(this.p2Oathkeeper.isParticipating()).toBe(true);
        });
    });
});

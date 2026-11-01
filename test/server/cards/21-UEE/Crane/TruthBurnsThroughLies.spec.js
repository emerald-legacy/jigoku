describe('Truth Burns Through Lies', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        { card: 'attendant-to-the-emperor', attachments: ['truth-burns-through-lies'] },
                        { card: 'cunning-magistrate', attachments: ['truth-burns-through-lies'] },
                        'shinjo-outrider'
                    ],
                    hand: ['truth-burns-through-lies']
                },
                player2: {
                    inPlay: ['doji-challenger', 'matsu-berserker', 'akodo-toturi']
                }
            });
            this.attendant = this.player1.findCardByName('attendant-to-the-emperor');
            this.magistrate = this.player1.findCardByName('cunning-magistrate');
            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.truthInHand = this.player1.findCardByName('truth-burns-through-lies', 'hand');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.toturi = this.player2.findCardByName('akodo-toturi');
        });

        it('attaches only to a Courtier or Magistrate character', function() {
            this.player1.clickCard(this.truthInHand);
            expect(this.player1).toBeAbleToSelect(this.attendant);
            expect(this.player1).toBeAbleToSelect(this.magistrate);
            expect(this.player1).not.toBeAbleToSelect(this.outrider);
            expect(this.player1).not.toBeAbleToSelect(this.toturi);
        });

        it('dishonors a participating character with lower printed cost than a Courtier', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.attendant, this.magistrate],
                defenders: [this.challenger, this.berserker, this.toturi]
            });
            this.player2.pass();
            this.player1.clickCard(this.attendant);
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.magistrate);
            expect(this.player1).not.toBeAbleToSelect(this.toturi);
            this.player1.clickCard(this.berserker);

            expect(this.berserker.isDishonored).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Attendant to the Emperor\'s gained ability from Truth Burns Through Lies to dishonor Matsu Berserker');
        });

        it('dishonors a participating character with equal or lower printed cost than a Magistrate', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.attendant, this.magistrate],
                defenders: [this.challenger, this.berserker, this.toturi]
            });
            this.player2.pass();
            this.player1.clickCard(this.magistrate);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.berserker);
            expect(this.player1).toBeAbleToSelect(this.attendant);
            expect(this.player1).not.toBeAbleToSelect(this.toturi);
            expect(this.player1).not.toBeAbleToSelect(this.outrider);
            this.player1.clickCard(this.challenger);

            expect(this.challenger.isDishonored).toBe(true);
        });
    });
});

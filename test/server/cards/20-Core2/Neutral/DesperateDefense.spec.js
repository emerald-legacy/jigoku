describe('Desperate Defense', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['samurai-of-integrity']
                },
                player2: {
                    fate: 5,
                    inPlay: ['siege-captain'],
                    hand: ['desperate-defense', 'desperate-defense']
                }
            });
            this.samurai = this.player1.findCardByName('samurai-of-integrity');
            this.captain = this.player2.findCardByName('siege-captain');
            this.defenses = this.player2.filterCardsByName('desperate-defense', 'hand');
            this.province = this.player2.findCardByName('shameful-display', 'province 1');
        });

        it('gives the attacked province +3 strength until the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.samurai],
                defenders: [this.captain],
                province: this.province
            });
            expect(this.province.getStrength()).toBe(3);
            this.player2.clickCard(this.defenses[0]);
            expect(this.province.getStrength()).toBe(6);
            expect(this.getChatLogs(5)).toContain('player2 plays Desperate Defense to increase the strength of an attacked province by 3');

            this.noMoreActions();
            expect(this.getChatLogs(10)).toContain('player2 won a military conflict 5 vs 3');
            expect(this.province.getStrength()).toBe(3);
        });

        it('cannot be played without a participating character you control', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.samurai],
                defenders: [],
                province: this.province
            });
            this.player2.clickCard(this.defenses[0]);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.defenses[0].location).toBe('hand');
            expect(this.province.getStrength()).toBe(3);
        });

        it('cannot be played a second time in the same conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.samurai],
                defenders: [this.captain],
                province: this.province
            });
            this.player2.clickCard(this.defenses[0]);
            expect(this.province.getStrength()).toBe(6);
            this.player1.pass();

            this.player2.clickCard(this.defenses[1]);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.defenses[1].location).toBe('hand');
            expect(this.province.getStrength()).toBe(6);
        });
    });
});

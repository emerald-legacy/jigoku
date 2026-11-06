describe('Methodical Secretary', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        { card: 'methodical-secretary', bowed: true },
                        { card: 'akodo-gunso', bowed: true },
                        'matsu-berserker'
                    ]
                },
                player2: {
                    inPlay: ['doji-whisperer', 'kakita-yoshi']
                }
            });
            this.secretary = this.player1.findCardByName('methodical-secretary');
            this.gunso = this.player1.findCardByName('akodo-gunso');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
        });

        it('should ready a character when the glory count begins', function() {
            this.yoshi.bow();
            this.flow.finishConflictPhase();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.secretary);
            this.player1.clickCard(this.secretary);
            expect(this.player1).toBeAbleToSelect(this.gunso);
            expect(this.player1).toBeAbleToSelect(this.secretary);
            expect(this.player1).toBeAbleToSelect(this.yoshi);
            this.player1.clickCard(this.gunso);
            expect(this.gunso.bowed).toBe(false);
        });

        it('should let the readied character count its glory', function() {
            this.whisperer.bow();
            this.yoshi.bow();
            this.flow.finishConflictPhase();
            this.player1.clickCard(this.secretary);
            this.player1.clickCard(this.gunso);
            // player1: Matsu Berserker (1) + Akodo Gunso (2) = 3 against player2: 0
            expect(this.player1).toHavePrompt('Which side of the Imperial Favor would you like to claim?');
            this.player1.clickPrompt('military');
            expect(this.player1.player.imperialFavor).toBe('military');
        });

        it('should not let the player win the favor without the ready character', function() {
            this.flow.finishConflictPhase();
            this.player1.pass();
            // player1: Matsu Berserker (1) against player2: Doji Whisperer (1) + Kakita Yoshi (3) = 4
            expect(this.player2).toHavePrompt('Which side of the Imperial Favor would you like to claim?');
            expect(this.gunso.bowed).toBe(true);
        });
    });
});

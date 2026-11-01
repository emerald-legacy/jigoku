describe('Jade Masterpiece', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    rings: ['earth'],
                    inPlay: [{ card: 'doji-whisperer', fate: 2 }],
                    hand: ['jade-masterpiece']
                },
                player2: {
                    inPlay: [{ card: 'bayushi-liar', fate: 2 }]
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.jadeMasterpiece = this.player1.playAttachment('jade-masterpiece', this.whisperer);
            this.player1.togglePromptedActionWindow('fate', true);
            this.player2.togglePromptedActionWindow('fate', true);
            // the fate phase puts 1 fate on each unclaimed ring before its action window
            this.flow.finishConflictPhase();
        });

        it('gives +1 political skill', function() {
            expect(this.whisperer.getPoliticalSkill()).toBe(4);
        });

        it('bows to move 1 fate from an unclaimed ring to another unclaimed ring', function() {
            expect(this.game.currentPhase).toBe('fate');
            expect(this.game.rings.air.fate).toBe(1);
            expect(this.game.rings.fire.fate).toBe(1);
            this.player1.clickCard(this.jadeMasterpiece);
            expect(this.player1).toHavePrompt('Choose an unclaimed ring to move fate from');
            expect(this.player1).toBeAbleToSelectRing('air');
            expect(this.player1).not.toBeAbleToSelectRing('earth');
            this.player1.clickRing('air');
            expect(this.player1).toHavePrompt('Choose an unclaimed ring to move fate to');
            expect(this.player1).toBeAbleToSelectRing('fire');
            expect(this.player1).not.toBeAbleToSelectRing('air');
            expect(this.player1).not.toBeAbleToSelectRing('earth');
            this.player1.clickRing('fire');
            expect(this.getChatLogs(5)).toContain('player1 uses Jade Masterpiece, bowing Jade Masterpiece to move 1 fate from Air Ring to an unclaimed ring');
            expect(this.game.rings.air.fate).toBe(0);
            expect(this.game.rings.fire.fate).toBe(2);
            expect(this.game.rings.earth.fate).toBe(0);
            expect(this.jadeMasterpiece.bowed).toBe(true);
        });

        it('cannot be used while bowed', function() {
            this.player1.clickCard(this.jadeMasterpiece);
            this.player1.clickRing('air');
            this.player1.clickRing('fire');
            expect(this.jadeMasterpiece.bowed).toBe(true);
            this.player2.pass();
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.jadeMasterpiece);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.game.rings.fire.fate).toBe(2);
        });
    });
});

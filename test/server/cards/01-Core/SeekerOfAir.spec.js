describe('Seeker of Air', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer'],
                    provinces: ['fertile-fields']
                },
                player2: {
                    role: 'seeker-of-air',
                    fate: 5,
                    inPlay: ['bayushi-kachiko'],
                    provinces: ['manicured-garden', 'entrenched-position']
                }
            });
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.kachiko = this.player2.findCardByName('bayushi-kachiko');
            this.seeker = this.player2.findCardByName('seeker-of-air');
            this.garden = this.player2.findCardByName('manicured-garden');
            this.entrenched = this.player2.findCardByName('entrenched-position');
            this.fertileFields = this.player1.findCardByName('fertile-fields');
            this.noMoreActions();
        });

        it('gains 1 fate after an Air province you control is revealed', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'fire',
                province: this.garden,
                attackers: [this.whisperer]
            });
            expect(this.garden.facedown).toBe(false);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.seeker);
            this.player2.clickCard(this.seeker);
            expect(this.player2.fate).toBe(6);
        });

        it('does not trigger after a province of another element you control is revealed', function() {
            this.initiateConflict({
                type: 'political',
                ring: 'air',
                province: this.entrenched,
                attackers: [this.whisperer]
            });
            expect(this.entrenched.facedown).toBe(false);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.player2.fate).toBe(5);
        });

        it('does not trigger after an opponent\'s Air province is revealed', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                ring: 'fire',
                province: this.fertileFields,
                attackers: [this.kachiko]
            });
            expect(this.fertileFields.facedown).toBe(false);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Choose defenders');
            expect(this.player2.fate).toBe(5);
        });
    });
});

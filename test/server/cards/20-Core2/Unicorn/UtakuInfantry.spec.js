describe('Utaku Infantry', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['utaku-infantry', 'shinjo-outrider', 'moto-youth', 'doji-whisperer']
                },
                player2: {
                    inPlay: ['border-rider']
                }
            });
            this.infantry = this.player1.findCardByName('utaku-infantry');
            this.outrider = this.player1.findCardByName('shinjo-outrider');
            this.youth = this.player1.findCardByName('moto-youth');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.borderRider = this.player2.findCardByName('border-rider');
        });

        it('gets +1/+1 for each participating Unicorn character you control', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.infantry, this.outrider, this.whisperer],
                defenders: [this.borderRider]
            });

            expect(this.youth.isParticipating()).toBe(false);
            expect(this.infantry.getMilitarySkill()).toBe(2);
            expect(this.infantry.getPoliticalSkill()).toBe(2);
        });

        it('counts itself when it participates alone', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.infantry],
                defenders: [this.borderRider]
            });

            expect(this.infantry.getMilitarySkill()).toBe(1);
            expect(this.infantry.getPoliticalSkill()).toBe(1);
        });

        it('gets no bonus while it is not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.outrider, this.youth],
                defenders: [this.borderRider]
            });

            expect(this.outrider.isParticipating()).toBe(true);
            expect(this.infantry.getMilitarySkill()).toBe(0);
            expect(this.infantry.getPoliticalSkill()).toBe(0);
        });
    });
});

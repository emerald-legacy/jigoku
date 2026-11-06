describe('Ide Tadaji', function() {
    integration(function() {
        describe('Ide Tadaji\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ide-tadaji', 'miya-mystic', 'border-rider']
                    },
                    player2: {
                        inPlay: ['doji-whisperer', 'adept-of-the-waves']
                    }
                });
                this.ideTadaji = this.player1.findCardByName('ide-tadaji');
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.borderRider = this.player1.findCardByName('border-rider');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.ideTadaji],
                    defenders: []
                });
            });

            it('should only allow non-participating characters for my character', function() {
                this.player2.pass();
                this.player1.clickCard(this.ideTadaji);
                // miya-mystic has cost 1 and is not participating - should be selectable
                expect(this.player1).toBeAbleToSelect(this.miyaMystic);
                // ide-tadaji is already participating - should not be selectable
                expect(this.player1).not.toBeAbleToSelect(this.ideTadaji);
            });

            it('should only allow non-participating characters for opponent\'s character', function() {
                this.player2.pass();
                this.player1.clickCard(this.ideTadaji);
                this.player1.clickCard(this.miyaMystic);
                // adept-of-the-waves (cost 2) is not participating - should be selectable
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
                // doji-whisperer (cost 1) is not participating - should be selectable
                expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
            });

            it('should move both characters to the conflict', function() {
                this.player2.pass();
                this.player1.clickCard(this.ideTadaji);
                this.player1.clickCard(this.miyaMystic);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.miyaMystic.inConflict).toBe(true);
                expect(this.dojiWhisperer.inConflict).toBe(true);
            });
        });
    });
});

describe('Ide Tadaji without an eligible character for each player', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ide-tadaji', 'miya-mystic']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'adept-of-the-waves'],
                    hand: ['pacifism']
                }
            });
            this.ideTadaji = this.player1.findCardByName('ide-tadaji');
            this.miyaMystic = this.player1.findCardByName('miya-mystic');
            this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
        });

        it('cannot move a character that cannot participate (#207)', function() {
            this.player1.pass();
            this.player2.playAttachment('pacifism', this.adeptOfTheWaves);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.ideTadaji],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.ideTadaji);
            this.player1.clickCard(this.miyaMystic);
            expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
            expect(this.player1).not.toBeAbleToSelect(this.adeptOfTheWaves);
        });

        it('cannot be used when the opponent has no eligible character (#206)', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.ideTadaji],
                defenders: [this.dojiWhisperer, this.adeptOfTheWaves]
            });
            this.player2.pass();
            this.player1.clickCard(this.ideTadaji);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.miyaMystic.isParticipating()).toBe(false);
        });
    });
});

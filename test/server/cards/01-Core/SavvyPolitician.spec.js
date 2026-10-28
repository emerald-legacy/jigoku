describe('Savvy Politician', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        'Savvy Politician',
                        'Moto Horde',
                        'Moto Horde'
                    ],
                    hand: ['Magnificent Kimono']
                },
                player2: {
                    inPlay: [
                        'Savvy Politician',
                        'Moto Horde'
                    ],
                    provinces: {
                        'province 1': {
                            provinceCard: 'The Art of Peace'
                        },
                        'province 2': {
                            provinceCard: 'Shameful Display'
                        }
                    }
                }
            });
            this.kimono = this.player1.hand[0];
            this.politician1 = this.player1.inPlay[0];
            this.politician2 = this.player2.inPlay[0];
            this.artofpeace = this.player2.provinces['province 1'].provinceCard;
        });

        describe('when the politician is already honored', function() {
            beforeEach(function() {
                this.politician1.honor();
                this.politician2.honor();
            });

            it('should not trigger its ability when winning a conflict with kimono attached', function() {
                this.player1.playAttachment(this.kimono, this.politician1);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['Savvy Politician'],
                    defenders: []
                });
                this.noMoreActions();
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.getChatLogs(3)).toContain('player1 won a military conflict 2 vs 0');
                expect(this.politician1.isHonored).toBe(true);
            });

            it('should not trigger its ability when breaking The Art of Peace', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['Moto Horde', 'Moto Horde'],
                    defenders: ['Savvy Politician'],
                    province: this.artofpeace
                });
                this.noMoreActions();
                // Player 2 prompted for The Art of Peace break trigger
                this.player2.clickCard(this.artofpeace);
                expect(this.getChatLogs(3)).toContain('player2 uses The Art of Peace to dishonor all attackers and honor all defenders in this conflict');
                expect(this.politician2.isHonored).toBe(true);
                expect(this.player2).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).not.toBeAbleToSelect(this.politician2);
            });
        });
    });
});

describe('Savvy Politician honored by its pride', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['savvy-politician', 'moto-horde'],
                    hand: ['magnificent-kimono']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.politician = this.player1.findCardByName('savvy-politician');
            this.horde = this.player1.findCardByName('moto-horde');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.player1.playAttachment('magnificent-kimono', this.politician);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.politician],
                defenders: []
            });
            this.noMoreActions();
        });

        it('should honor a chosen character', function() {
            expect(this.politician.isHonored).toBe(true);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.politician);
            expect(this.player1).toBeAbleToSelect(this.horde);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.politician);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.isHonored).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Savvy Politician to honor Doji Whisperer');
        });
    });
});

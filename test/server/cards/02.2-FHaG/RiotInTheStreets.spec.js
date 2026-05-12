describe('Riot in the Streets', function() {
    integration(function() {
        describe('Riot in the Streets\' ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['miya-mystic']
                    },
                    player2: {
                        inPlay: ['matsu-berserker', 'serene-warrior', 'valiant-oathkeeper'],
                        provinces: ['riot-in-the-streets']
                    }
                });
                this.miyaMystic = this.player1.findCardByName('miya-mystic');
                this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
                this.sereneWarrior = this.player2.findCardByName('serene-warrior');
                this.valiantOathkeeper = this.player2.findCardByName('valiant-oathkeeper');
                this.riotInTheStreets = this.player2.findCardByName('riot-in-the-streets', 'province 1');
            });

            it('should be usable when 3 or more bushi are participating', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.miyaMystic],
                    defenders: [this.matsuBerserker, this.sereneWarrior, this.valiantOathkeeper],
                    province: this.riotInTheStreets
                });
                this.player2.clickCard(this.riotInTheStreets);
                expect(this.player2).toHavePrompt('Choose a character');
            });

            it('should bow a participating character', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.miyaMystic],
                    defenders: [this.matsuBerserker, this.sereneWarrior, this.valiantOathkeeper],
                    province: this.riotInTheStreets
                });
                this.player2.clickCard(this.riotInTheStreets);
                this.player2.clickCard(this.miyaMystic);
                expect(this.miyaMystic.bowed).toBe(true);
            });

            it('should not be usable with fewer than 3 participating bushi', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.miyaMystic],
                    defenders: [this.matsuBerserker, this.sereneWarrior],
                    province: this.riotInTheStreets
                });
                this.player2.clickCard(this.riotInTheStreets);
                expect(this.player2).not.toHavePrompt('Choose a character');
            });
        });
    });
});

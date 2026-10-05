describe('playing a character as if it were in hand', function () {
    integration(function () {
        describe('from a province with Daidoji Hiroteru', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['daidoji-hiroteru'],
                        dynastyDiscard: ['cautious-scout'],
                        fate: 10
                    }
                });
                this.scout = this.player1.placeCardInProvince('cautious-scout', 'province 1');
                this.scout.facedown = true;
                this.game.checkGameState(true);
            });

            it('turns a facedown character faceup as it is played', function () {
                this.player1.clickCard(this.scout);
                this.player1.clickPrompt('0');
                expect(this.scout.location).toBe('play area');
                expect(this.scout.facedown).toBe(false);
            });
        });

        describe('from a province with Hidden Moon Dojo', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 10,
                        dynastyDiscard: ['hidden-moon-dojo', 'bayushi-liar']
                    }
                });
                this.liar = this.player1.placeCardInProvince('bayushi-liar', 'province 1');
                this.liar.facedown = true;
                this.dojo = this.player1.placeCardInProvince('hidden-moon-dojo', 'province 2');
                this.game.checkGameState(true);
            });

            it('cannot play a facedown character', function () {
                this.player1.clickCard(this.liar);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.liar.location).toBe('province 1');
                expect(this.liar.facedown).toBe(true);
            });
        });

        describe('from the top of the dynasty deck with Third Whisker Warrens', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['agasha-swordsmith']
                    },
                    player2: {
                        dynastyDiscard: ['kitsu-warrior', 'third-whisker-warrens'],
                        fate: 10
                    }
                });
                this.swordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.warrior = this.player2.findCardByName('kitsu-warrior', 'dynasty discard pile');
                this.warrens = this.player2.findCardByName('third-whisker-warrens');
                this.player2.moveCard(this.warrens, 'province 1');
                this.warrens.facedown = false;
                this.player2.moveCard(this.warrior, 'dynasty deck');
                this.province = this.player2.findCardByName('shameful-display', 'province 1');
            });

            it('plays a top card that is still marked facedown', function () {
                this.warrior.facedown = true;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.swordsmith],
                    defenders: [],
                    province: this.province
                });
                this.player2.clickCard(this.warrior);
                this.player2.clickPrompt('0');
                this.player2.clickPrompt('conflict');
                expect(this.warrior.location).toBe('play area');
                expect(this.warrior.facedown).toBe(false);
            });
        });
    });
});

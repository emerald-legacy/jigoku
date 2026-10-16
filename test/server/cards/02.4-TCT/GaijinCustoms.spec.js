describe('Gaijin Customs', function() {
    integration(function() {
        describe('with a unicorn holding', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer'],
                        hand: ['gaijin-customs'],
                        dynastyDiscard: ['shiotome-encampment']
                    }
                });
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.whisperer.bowed = true;
                this.encampment = this.player1.placeCardInProvince('shiotome-encampment', 'province 1');
                this.encampment.facedown = false;
                this.gaijinCustoms = this.player1.findCardByName('gaijin-customs');
            });

            it('should ready a non-unicorn character', function() {
                this.player1.clickCard(this.gaijinCustoms);
                this.player1.clickCard(this.whisperer);
                expect(this.whisperer.bowed).toBe(false);
            });
        });

        describe('with a unicorn stronghold', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        stronghold: 'shiro-shinjo',
                        inPlay: ['doji-whisperer'],
                        hand: ['gaijin-customs']
                    }
                });
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.whisperer.bowed = true;
                this.gaijinCustoms = this.player1.findCardByName('gaijin-customs');
            });

            it('should ready a non-unicorn character', function() {
                this.player1.clickCard(this.gaijinCustoms);
                this.player1.clickCard(this.whisperer);
                expect(this.whisperer.bowed).toBe(false);
            });
        });

        describe('without a unicorn card', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer'],
                        hand: ['gaijin-customs']
                    }
                });
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.whisperer.bowed = true;
                this.gaijinCustoms = this.player1.findCardByName('gaijin-customs');
            });

            it('should not be playable', function() {
                this.player1.clickCard(this.gaijinCustoms);
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.whisperer.bowed).toBe(true);
            });
        });
    });
});

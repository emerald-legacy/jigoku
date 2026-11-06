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

        describe('choosing a character', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [
                            { card: 'doji-whisperer', bowed: true },
                            { card: 'border-rider', bowed: true },
                            { card: 'aggressive-moto', bowed: true, attachments: ['seal-of-the-crab'] },
                            { card: 'doji-challenger', bowed: true, attachments: ['seal-of-the-unicorn'] }
                        ],
                        hand: ['gaijin-customs']
                    },
                    player2: {
                        inPlay: [
                            { card: 'moto-youth', bowed: true },
                            { card: 'kakita-asami', bowed: true }
                        ]
                    }
                });
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.borderRider = this.player1.findCardByName('border-rider');
                this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.motoYouth = this.player2.findCardByName('moto-youth');
                this.asami = this.player2.findCardByName('kakita-asami');
                this.gaijinCustoms = this.player1.findCardByName('gaijin-customs');
            });

            it('can only choose a non-unicorn character', function() {
                this.player1.clickCard(this.gaijinCustoms);
                expect(this.player1).toHavePrompt('Gaijin Customs');
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).toBeAbleToSelect(this.asami);
                expect(this.player1).not.toBeAbleToSelect(this.borderRider);
                expect(this.player1).not.toBeAbleToSelect(this.motoYouth);
            });

            it('cannot choose a unicorn character that gained another clan (ruling #334)', function() {
                expect(this.aggressiveMoto.isFaction('crab')).toBe(true);
                this.player1.clickCard(this.gaijinCustoms);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.aggressiveMoto);
            });

            it('cannot choose a character that gained the unicorn clan', function() {
                expect(this.challenger.isFaction('unicorn')).toBe(true);
                this.player1.clickCard(this.gaijinCustoms);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                expect(this.player1).not.toBeAbleToSelect(this.challenger);
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

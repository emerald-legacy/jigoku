describe('Breach of Etiquette', function() {
    integration(function() {
        describe('Breach of Etiquette\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['yogo-hiroue', 'soshi-illusionist', 'bayushi-yunako'],
                        hand: ['watch-commander']
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['brash-samurai', 'doji-whisperer'],
                        hand: ['breach-of-etiquette', 'banzai']
                    }
                });
                this.brashSamurai = this.player2.findCardByName('brash-samurai');
                this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
                this.soshiIllusionist = this.player1.findCardByName('soshi-illusionist');
                this.yogoHiroue = this.player1.findCardByName('yogo-hiroue');
                this.watchCommander = this.player1.playAttachment('watch-commander', 'yogo-hiroue');
                this.banzai = this.player2.findCardByName('banzai', 'hand');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['yogo-hiroue', 'bayushi-yunako'],
                    defenders: ['brash-samurai']
                });
                this.player2.clickCard('breach-of-etiquette');
                this.player1.pass();
            });

            it('should trigger when the opponent uses a non-courtier ability', function() {
                this.player1.clickCard('bayushi-yunako');
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1.honor).toBe(9);
                expect(this.brashSamurai.militarySkill).toBe(1);
                expect(this.getChatLogs(5)).toContain('player1 loses 1 honor due to Breach of Etiquette');
            });

            it('should not trigger when an opponent cancels a non-courtier ability', function() {
                this.player1.clickCard('bayushi-yunako');
                this.player1.clickPrompt('Cancel');
                expect(this.player1.honor).toBe(10);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should trigger when the player uses a non-courtier ability', function() {
                this.player1.pass();
                this.player2.clickCard(this.brashSamurai);
                expect(this.player2.honor).toBe(10);
                expect(this.brashSamurai.militarySkill).toBe(4);
                expect(this.getChatLogs(5)).toContain('player2 loses 1 honor due to Breach of Etiquette');
            });

            it('should not trigger when a courtier uses an ability', function() {
                this.player1.clickCard(this.yogoHiroue);
                this.player1.clickCard(this.dojiWhisperer);
                expect(this.player1.honor).toBe(10);
                expect(this.dojiWhisperer.inConflict).toBe(true);
            });

            it('should trigger when a non-courtier outside the conflict uses an ability', function() {
                this.player1.pass();
                this.player2.clickCard(this.brashSamurai);
                this.player1.clickCard(this.soshiIllusionist);
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1.honor).toBe(9);
                expect(this.brashSamurai.militarySkill).toBe(2);
            });

            it('should not trigger when an event is played', function () {
                this.player1.pass();
                const honorBefore = this.player2.honor;
                this.player2.clickCard(this.banzai);
                this.player2.clickCard(this.brashSamurai);
                this.player2.clickPrompt('Done');
                expect(this.player2.honor).toBe(honorBefore);
            });

            it('should have no effect after the conflict ends', function () {
                this.player1.pass();
                this.player2.clickCard(this.brashSamurai);
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Break Shameful Display');
                this.player1.clickPrompt('No');
                this.player1.clickPrompt('Don\'t Resolve');
                const honorBefore = this.player1.honor;
                this.player1.clickCard(this.soshiIllusionist);
                this.player1.clickCard(this.brashSamurai);
                expect(this.player1.honor).toBe(honorBefore);
            });
        });

        describe('Breach of Etiquette\'s max 1 per conflict', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 10,
                        inPlay: ['bayushi-yunako'],
                        hand: []
                    },
                    player2: {
                        honor: 11,
                        inPlay: ['brash-samurai'],
                        hand: ['breach-of-etiquette', 'breach-of-etiquette']
                    }
                });
                this.brashSamurai = this.player2.findCardByName('brash-samurai');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: ['bayushi-yunako'],
                    defenders: ['brash-samurai']
                });
                this.player2.clickCard('breach-of-etiquette');
                this.player1.pass();
            });

            it('should not be playable a second time in the same conflict', function() {
                const secondBreachOfEtiquette = this.player2.filterCardsByName('breach-of-etiquette', 'hand')[0];
                this.player2.clickCard(secondBreachOfEtiquette);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});

describe('Breach of Etiquette and resolved abilities', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['diplomat-of-the-steppes', 'bayushi-yunako']
                },
                player2: {
                    honor: 10,
                    fate: 10,
                    inPlay: ['brash-samurai'],
                    hand: ['breach-of-etiquette', 'battlefield-orders']
                }
            });
            this.diplomat = this.player1.findCardByName('diplomat-of-the-steppes');
            this.yunako = this.player1.findCardByName('bayushi-yunako');
            this.brashSamurai = this.player2.findCardByName('brash-samurai');
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.diplomat, this.yunako],
                defenders: []
            });
            this.player2.clickCard('breach-of-etiquette');
            this.player1.clickCard(this.diplomat);
        });

        it('does not make a player lose honor for an ability resolved by Battlefield Orders', function() {
            expect(this.game.currentConflict.conflictType).toBe('military');
            expect(this.player1.honor).toBe(8);
            this.player2.clickCard('battlefield-orders');
            this.player2.clickCard(this.yunako);
            expect(this.player1).toHavePrompt('Choose a character');
            this.player1.clickCard(this.brashSamurai);
            expect(this.brashSamurai.getMilitarySkill()).toBe(1);
            expect(this.player1.honor).toBe(8);
            expect(this.player2.honor).toBe(10);
        });
    });
});

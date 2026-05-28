describe('Tennyo\'s Blessing', function() {
    integration(function() {
        describe('Tennyo\'s Blessing action', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        hand: ['tennyo-s-blessing'],
                        dynastyDiscard: [
                            'doji-whisperer',
                            'asahina-artisan',
                            'togashi-initiate',
                            'border-rider'
                        ]
                    },
                    player2: {}
                });

                this.blessing = this.player1.findCardByName('tennyo-s-blessing');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.artisan = this.player1.findCardByName('asahina-artisan');
                this.togashiInitiate = this.player1.findCardByName('togashi-initiate');
                this.borderRider = this.player1.findCardByName('border-rider');

                this.player1.reduceDeckToNumber('dynasty deck', 0);
                this.player1.moveCard(this.borderRider, 'dynasty deck');
                this.player1.moveCard(this.togashiInitiate, 'dynasty deck');
                this.player1.moveCard(this.artisan, 'dynasty deck');
                this.player1.moveCard(this.whisperer, 'dynasty deck');

                this.stronghold = this.player1.findCardByName('city-of-the-open-hand');
                this.province1 = this.player1.findCardByName('shameful-display', 'province 1');
                this.province2 = this.player1.findCardByName('shameful-display', 'province 2');
            });

            it('should be playable during the dynasty phase', function() {
                this.player1.clickCard(this.blessing);
                expect(this.player1).not.toHavePrompt('Action Window');
                expect(this.player1).toBeAbleToSelect(this.province1);
            });

            it('should not allow targeting the stronghold province', function() {
                this.player1.clickCard(this.blessing);
                expect(this.player1).not.toBeAbleToSelect(this.stronghold);
                expect(this.player1).toBeAbleToSelect(this.province1);
                expect(this.player1).toBeAbleToSelect(this.province2);
            });

            it('should put up to 2 selected cards faceup into the target province', function() {
                this.player1.clickCard(this.blessing);
                this.player1.clickCard(this.province1);
                expect(this.player1).toHavePromptButton('Doji Whisperer');
                expect(this.player1).toHavePromptButton('Asahina Artisan');
                expect(this.player1).toHavePromptButton('Togashi Initiate');
                expect(this.player1).toHavePromptButton('Border Rider');
                this.player1.clickPrompt('Doji Whisperer');
                this.player1.clickPrompt('Border Rider');
                expect(this.whisperer.location).toBe('province 1');
                expect(this.whisperer.facedown).toBe(false);
                expect(this.borderRider.location).toBe('province 1');
                expect(this.borderRider.facedown).toBe(false);
            });

            it('should allow selecting no cards', function() {
                this.player1.clickCard(this.blessing);
                this.player1.clickCard(this.province1);
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Take nothing');
                expect(this.whisperer.location).toBe('dynasty deck');
                expect(this.artisan.location).toBe('dynasty deck');
                expect(this.togashiInitiate.location).toBe('dynasty deck');
                expect(this.borderRider.location).toBe('dynasty deck');
                expect(this.getChatLogs(5)).toContain('player1 selects no cards');
            });
        });
    });
});

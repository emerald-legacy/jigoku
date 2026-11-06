describe('Togashi Acolyte', function () {
    integration(function () {
        describe('Togashi Acolyte as an attachment', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doji-whisperer', 'doji-kuwanan', 'kitsu-spiritcaller'],
                        hand: ['a-new-name', 'togashi-acolyte', 'backhanded-compliment']
                    },
                    player2: {
                        inPlay: [],
                        hand: ['backhanded-compliment', 'let-go', 'assassination']
                    }
                });

                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.kuwanan = this.player1.findCardByName('doji-kuwanan');
                this.newName = this.player1.findCardByName('a-new-name');
                this.acolyte = this.player1.findCardByName('togashi-acolyte');
                this.spiritcaller = this.player1.findCardByName('kitsu-spiritcaller');
                this.p1BHC = this.player1.findCardByName('backhanded-compliment');
                this.p2BHC = this.player2.findCardByName('backhanded-compliment');
                this.assassination = this.player2.findCardByName('assassination');
                this.letGo = this.player2.findCardByName('let-go');
            });

            it('can be played as an attachment', function () {
                this.player1.clickCard(this.acolyte);
                this.player1.clickPrompt('Play Togashi Acolyte as an attachment');
                this.player1.clickCard(this.whisperer);
                expect(this.whisperer.attachments.length).toBe(1);
            });

            it('should be treated as an attachment in play', function () {
                this.player1.clickCard(this.acolyte);
                this.player1.clickPrompt('Play Togashi Acolyte as an attachment');
                this.player1.clickCard(this.whisperer);

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer, this.kuwanan],
                    defenders: []
                });

                this.player2.clickCard(this.assassination);
                expect(this.player2).toBeAbleToSelect(this.whisperer);
                expect(this.player2).not.toBeAbleToSelect(this.acolyte);

                this.player2.clickPrompt('Cancel');

                this.player2.clickCard(this.letGo);
                expect(this.player2).toBeAbleToSelect(this.acolyte);
            });

            it('should be treated as a character if it goes to the discard pile', function () {
                this.player1.clickCard(this.acolyte);
                this.player1.clickPrompt('Play Togashi Acolyte as an attachment');
                this.player1.clickCard(this.whisperer);

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer, this.kuwanan],
                    defenders: []
                });

                this.player2.clickCard(this.letGo);
                this.player2.clickCard(this.acolyte);
                expect(this.acolyte.location).toBe('conflict discard pile');

                this.player1.clickCard(this.spiritcaller);
                expect(this.player1).toBeAbleToSelect(this.acolyte);
                this.player1.clickCard(this.acolyte);
                expect(this.acolyte.location).toBe('play area');
            });

            it('should give +1/+1', function () {
                this.player1.clickCard(this.acolyte);
                this.player1.clickPrompt('Play Togashi Acolyte as an attachment');
                this.player1.clickCard(this.whisperer);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer, this.kuwanan],
                    defenders: []
                });

                const mil = this.whisperer.militarySkill;
                const pol = this.whisperer.politicalSkill;

                this.player2.pass();
                this.player1.clickCard(this.p1BHC);
                this.player1.clickPrompt('player2');
                expect(this.player1).toBeAbleToSelect(this.acolyte);
                this.player1.clickCard(this.acolyte);
                expect(this.whisperer.militarySkill).toBe(mil + 1);
                expect(this.whisperer.politicalSkill).toBe(pol + 1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(3)).toContain(
                    'player1 uses Togashi Acolyte to give +1political and +1military to Doji Whisperer'
                );
            });

            it('should not trigger off opponent cards', function () {
                this.player1.clickCard(this.acolyte);
                this.player1.clickPrompt('Play Togashi Acolyte as an attachment');
                this.player1.clickCard(this.whisperer);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer, this.kuwanan],
                    defenders: []
                });

                const mil = this.whisperer.militarySkill;
                const pol = this.whisperer.politicalSkill;

                this.player2.clickCard(this.p2BHC);
                this.player2.clickPrompt('player2');
                expect(this.player1).not.toBeAbleToSelect(this.acolyte);
                this.player1.clickCard(this.acolyte);
                expect(this.whisperer.militarySkill).toBe(mil);
                expect(this.whisperer.politicalSkill).toBe(pol);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should not be usable if holder is not participating', function () {
                this.player1.clickCard(this.acolyte);
                this.player1.clickPrompt('Play Togashi Acolyte as an attachment');
                this.player1.clickCard(this.whisperer);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.kuwanan],
                    defenders: []
                });

                const pol = this.whisperer.politicalSkill;

                this.player2.pass();
                this.player1.clickCard(this.p1BHC);
                this.player1.clickPrompt('player2');
                expect(this.player1).not.toBeAbleToSelect(this.acolyte);
                this.player1.clickCard(this.acolyte);
                expect(this.whisperer.politicalSkill).toBe(pol);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should trigger off itself', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer, this.kuwanan],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.acolyte);
                this.player1.clickPrompt('Play Togashi Acolyte as an attachment');
                expect(this.player1).toBeAbleToSelect(this.whisperer);
                this.player1.clickCard(this.whisperer);
                expect(this.player1).toBeAbleToSelect(this.acolyte);
            });

            it('can be played as a character', function () {
                this.player1.clickCard(this.acolyte);
                this.player1.clickPrompt('Play this character');
                this.player1.clickPrompt('0');
                expect(this.acolyte.location).toBe('play area');
            });

            it('should not give +1/+1 as a character', function () {
                this.player1.clickCard(this.acolyte);
                this.player1.clickPrompt('Play this character');
                this.player1.clickPrompt('0');
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.whisperer, this.kuwanan, this.acolyte],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.p1BHC);
                this.player1.clickPrompt('player2');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Togashi Acolyte and cards put into play', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['togashi-mitsu'],
                        hand: ['niten', 'togashi-acolyte', 'fine-katana']
                    },
                    player2: {
                        inPlay: []
                    }
                });

                this.mitsu = this.player1.findCardByName('togashi-mitsu');
                this.niten = this.player1.findCardByName('niten');
                this.acolyte = this.player1.findCardByName('togashi-acolyte');
                this.katana = this.player1.findCardByName('fine-katana');

                this.player1.playAttachment(this.niten, this.mitsu);
                this.player2.pass();
                this.player1.clickCard(this.acolyte);
                this.player1.clickPrompt('Play Togashi Acolyte as an attachment');
                this.player1.clickCard(this.mitsu);
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.mitsu]
                });
                expect(this.player1).toHavePrompt('Choose covert target for Togashi Mitsu');
                this.player1.clickPrompt('No Target');
                this.player2.clickPrompt('Done');
                this.player2.pass();
            });

            it('should not trigger when a card is put into play by a card effect (ruling #795)', function () {
                expect(this.mitsu.attachments).toContain(this.acolyte);
                expect(this.mitsu.militarySkill).toBe(5);
                expect(this.mitsu.politicalSkill).toBe(4);
                this.player1.clickCard(this.niten);
                expect(this.player1).toHavePrompt('Niten');
                this.player1.clickCard(this.katana);
                expect(this.mitsu.attachments).toContain(this.katana);
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.mitsu.militarySkill).toBe(6);
                expect(this.mitsu.politicalSkill).toBe(3);
            });
        });
    });
});

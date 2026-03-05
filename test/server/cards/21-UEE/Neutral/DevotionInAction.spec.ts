describe('Devotion in Action', () => {
  integration(() => {
    beforeEach(function () {
      this.setupTest({
        phase: 'conflict',
        player1: {
          hand: ['devotion-in-action', 'master-of-the-spear'],
          inPlay: ['ikoma-prodigy'],
          dynastyDiscard: ['matsu-berserker', 'ikoma-message-runner', 'matsu-sakura', 'akodo-yoshitsune'],
        },
        player2: {
          inPlay: ['bayushi-manipulator', 'court-novice'],
        },
      });

      this.devotionInAction = this.player1.findCardByName('devotion-in-action');
      this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
      this.masterOfTheSpear = this.player1.findCardByName('master-of-the-spear');
      this.matsuBerserker = this.player1.placeCardInProvince('matsu-berserker', 'province 1');
      this.ikomaMessageRunner = this.player1.placeCardInProvince('ikoma-message-runner', 'province 2');
      this.matsuSakura = this.player1.placeCardInProvince('matsu-sakura', 'province 3');
      this.akodoYoshitsune = this.player1.placeCardInProvince('akodo-yoshitsune', 'province 4');

      this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');
      this.courtNovice = this.player2.findCardByName('court-novice');

      this.noMoreActions();
    });

    it('does nothing unless outnumbered', function () {
      this.initiateConflict({
        attackers: [this.ikomaProdigy],
        defenders: [this.bayushiManipulator],
      });
      this.player2.pass();
      this.player1.clickCard(this.devotionInAction);
      expect(this.player1).toHavePrompt('Conflict Action Window');
    });

    it('when outnumbered, chooses a character to put in play', function () {
      this.initiateConflict({
        attackers: [this.ikomaProdigy],
        defenders: [this.bayushiManipulator, this.courtNovice],
      });
      this.player2.pass();
      this.player1.clickCard(this.devotionInAction);
      expect(this.player1).toHavePrompt('Devotion in Action');
      expect(this.player1).toBeAbleToSelect(this.matsuBerserker);
      expect(this.player1).toBeAbleToSelect(this.matsuSakura);
      expect(this.player1).toBeAbleToSelect(this.masterOfTheSpear);
      expect(this.player1).not.toBeAbleToSelect(this.ikomaMessageRunner);
      expect(this.player1).not.toBeAbleToSelect(this.akodoYoshitsune);
    });

    it('the character enters play ordinary unless yojimbo', function () {
      this.initiateConflict({
        attackers: [this.ikomaProdigy],
        defenders: [this.bayushiManipulator, this.courtNovice],
      });
      this.player2.pass();
      this.player1.clickCard(this.devotionInAction);
      this.player1.clickCard(this.matsuBerserker);
      expect(this.matsuBerserker.location).toBe('play area');
      expect(this.matsuBerserker.isParticipating()).toBe(true);
      expect(this.matsuBerserker.isHonored).toBe(false);
      expect(this.getChatLogs(5)).toContain(
        'player1 plays Devotion in Action to put Matsu Berserker into play in the conflict',
      );
    });

    it('the character enters play honored when yojimbo', function () {
      this.initiateConflict({
        attackers: [this.ikomaProdigy],
        defenders: [this.bayushiManipulator, this.courtNovice],
      });
      this.player2.pass();
      this.player1.clickCard(this.devotionInAction);
      this.player1.clickCard(this.matsuSakura);
      expect(this.matsuSakura.location).toBe('play area');
      expect(this.matsuSakura.isParticipating()).toBe(true);
      expect(this.matsuSakura.isHonored).toBe(true);
      expect(this.getChatLogs(5)).toContain(
        'player1 plays Devotion in Action to put Matsu Sakura into play in the conflict',
      );
    });

    it('the character stays in play after the conflict ends', function () {
      this.initiateConflict({
        attackers: [this.ikomaProdigy],
        defenders: [this.bayushiManipulator, this.courtNovice],
      });
      this.player2.pass();
      this.player1.clickCard(this.devotionInAction);
      this.player1.clickCard(this.matsuSakura);
      this.noMoreActions();

      this.player1.clickPrompt("Don't resolve");
      expect(this.player1).toHavePrompt('Action Window');
      expect(this.matsuSakura.location).toBe('play area');
    });
  });
});
